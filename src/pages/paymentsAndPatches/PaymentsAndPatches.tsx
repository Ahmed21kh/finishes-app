/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Row, Col, Tag, Tooltip } from "antd";
import { getAccountStatementsNames } from "../../apis/AccountStatementsApi";
import {
  getTransactionsByClientApi,
  deleteTransactionApi,
} from "../../apis/TransactionsApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import PageHeader from "../../components/PageHeader";
import ButtonComponent from "../../components/ButtonComponent";
import StatCard from "../../components/StatCard";
import PrintTransactionInvoice from "../../components/PrintTransactionInvoice";
import AddEditTransactionModal from "../../components/AddEditTransactionModal";
import ModalComponent from "../../components/ModalComponent";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import {
  DollarOutlined,
  FileTextOutlined,
  UserOutlined,
  PrinterFilled,
  EditFilled,
  DeleteFilled,
  PlusOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Transaction } from "../../types";

export const PaymentsAndPatches = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm, contextHolder } = useConfirmDialog();

  const [clientId, setClientId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Modal & Print States
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const invoicePrintRef = useRef<HTMLDivElement>(null);

  const fetchClientNames = () => {
    return getAccountStatementsNames();
  };

  const { data: clients, isLoading: loadingClients } = useQuery(
    ["clientsNames"],
    fetchClientNames
  );

  // Fetch all transactions for the selected client
  const { data: clientData, isLoading: loadingTransactions } = useQuery(
    ["clientTransactions", clientId],
    () => getTransactionsByClientApi(clientId as string),
    { enabled: Boolean(clientId) }
  );

  const transactions = clientData?.transactions || [];
  const client = clientData?.client;
  const selectedTransaction = transactions.find(
    (t: Transaction) => t._id === transactionId
  );

  // Print function
  const printInvoiceFn = useReactToPrint({
    contentRef: invoicePrintRef,
    documentTitle: `فاتورة-${selectedTransaction?.title || "معاملة"}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0mm !important;
      }
      @media print {
        body {
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  // Delete transaction mutation
  const { mutate: deleteTxMutate } = useMutation(
    (txId: string) => deleteTransactionApi(txId),
    {
      onSuccess: () => {
        toast.success("تم حذف المعاملة بنجاح");
        queryClient.invalidateQueries(["clientTransactions", clientId]);
        queryClient.invalidateQueries(["accountStatements"]);
        setTransactionId(null);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف المعاملة");
      },
    }
  );

  const handleDeleteCurrentTx = () => {
    if (!selectedTransaction?._id) return;
    confirm({
      title: "تأكيد حذف المعاملة",
      content: `هل أنت متأكد من حذف معاملة "${selectedTransaction.title}"؟ سيتم حذف جميع مصروفاتها ودفعاتها.`,
      okText: "نعم، احذف",
      cancelText: "إلغاء",
      onConfirm: () => {
        deleteTxMutate(selectedTransaction._id!);
      },
    });
  };

  const updateSearchParams = (newParams: any) => {
    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      Object.keys(newParams).forEach((key) => {
        if (newParams[key]) {
          updatedParams.set(key, newParams[key]);
        } else {
          updatedParams.delete(key);
        }
      });
      return updatedParams;
    });
  };

  const changeClient = (value: any) => {
    setClientId(value);
    setTransactionId(null);
    updateSearchParams({ client: value, transaction: null });
  };

  const changeTransaction = (value: any) => {
    setTransactionId(value);
    updateSearchParams({ transaction: value });
  };

  useEffect(() => {
    const urlClient = searchParams.get("client");
    const urlTransaction = searchParams.get("transaction");
    if (urlClient) {
      setClientId(urlClient);
    }
    if (urlTransaction) {
      setTransactionId(urlTransaction);
    }
  }, [searchParams]);

  const handleTransactionSaved = (savedTx: Transaction, shouldPrint?: boolean) => {
    queryClient.invalidateQueries(["clientTransactions", clientId]);
    queryClient.invalidateQueries(["accountStatements"]);
    setTransactionId(savedTx._id || null);

    if (shouldPrint) {
      setOpenPrintModal(true);
      setTimeout(() => {
        printInvoiceFn();
      }, 400);
    }
  };

  const filterOption = (input: string, option: any) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // Calculations for selected transaction
  const totalPatches = selectedTransaction?.totalPatches ?? 
    selectedTransaction?.patches?.reduce((s, p) => s + (Number(p.amount) || 0), 0) ?? 0;
  const totalPayments = selectedTransaction?.totalPayments ?? 
    selectedTransaction?.payments?.reduce((s, p) => s + (Number(p.price) || 0), 0) ?? 0;
  const balance = totalPatches - totalPayments;
  const isCreditor = balance >= 0;

  return (
    <>
      {contextHolder}

      {/* Hidden printable invoice */}
      <div style={{ display: "none" }}>
        {selectedTransaction && client && (
          <PrintTransactionInvoice
            ref={invoicePrintRef}
            transaction={selectedTransaction}
            client={client}
          />
        )}
      </div>

      {/* Modal: Add or Edit Transaction */}
      {clientId && client && (
        <AddEditTransactionModal
          visible={transactionModalOpen}
          onClose={() => setTransactionModalOpen(false)}
          accountStatementId={clientId}
          clientName={client.clientName}
          editingTransaction={editingTransaction}
          onSuccess={handleTransactionSaved}
        />
      )}

      {/* Modal: Print Invoice Preview */}
      <ModalComponent
        width={850}
        title={
          <div className="flex items-center gap-2">
            <PrinterFilled className="text-blue-500" />
            <span>معاينة طباعة الفاتورة: {selectedTransaction?.title}</span>
          </div>
        }
        open={openPrintModal}
        onCancel={() => setOpenPrintModal(false)}
        footer={
          <div className="flex justify-end gap-3 pt-2">
            <ButtonComponent text="إلغاء" onClick={() => setOpenPrintModal(false)} />
            <ButtonComponent
              type="primary"
              icon={<PrinterFilled />}
              text="طباعة الفاتورة الآن"
              onClick={() => printInvoiceFn()}
            />
          </div>
        }
      >
        {selectedTransaction && client && (
          <div className="max-h-[75vh] overflow-y-auto border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 p-2">
            <PrintTransactionInvoice
              transaction={selectedTransaction}
              client={client}
            />
          </div>
        )}
      </ModalComponent>

      <div className="space-y-6 animate-fade-in font-cairo">
        <PageHeader
          title="إدارة المصروفات والمدفوعات"
          subtitle="حدد العميل والمعاملة لعرض وتعديل كافة الدفعات والمصروفات وطباعة الفاتورة فوراً"
          icon={<DollarOutlined />}
          extra={
            clientId && (
              <div className="flex items-center gap-2">
                <ButtonComponent
                  type="primary"
                  icon={<PlusOutlined />}
                  text="إضافة معاملة جديدة"
                  onClick={() => {
                    setEditingTransaction(null);
                    setTransactionModalOpen(true);
                  }}
                  className="font-bold shadow-sm"
                />
                <ButtonComponent
                  icon={<FileTextOutlined />}
                  text="كشف حساب العميل الشامل"
                  onClick={() => navigate(`/account-statement/${clientId}`)}
                />
              </div>
            )
          }
        />

        {/* Selectors Bar */}
        <CardComponent className="p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 flex items-center gap-1.5">
                <UserOutlined className="text-blue-500" />
                اختيار العميل
              </label>
              <Select
                allowClear
                loading={loadingClients}
                options={clients?.clientsNames?.map((c: any) => ({
                  value: c.id,
                  label: c.name,
                }))}
                showSearch
                filterOption={filterOption}
                className="!w-full !rounded-xl"
                size="large"
                placeholder="ابحث أو اختر العميل..."
                value={clientId || undefined}
                onChange={changeClient}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 flex items-center gap-1.5">
                <FileTextOutlined className="text-blue-500" />
                اختيار المعاملة / الفاتورة
              </label>
              <Select
                allowClear
                disabled={!clientId}
                loading={loadingTransactions}
                options={transactions.map((t: Transaction) => ({
                  value: t._id,
                  label: `#${t.code || 1000} - ${t.title} (${dayjs(t.date).format("YYYY/MM/DD")}) - ${t.status || "قيد التنفيذ"}`,
                }))}
                showSearch
                filterOption={filterOption}
                className="!w-full !rounded-xl"
                size="large"
                placeholder={
                  clientId
                    ? transactions.length > 0
                      ? "اختر المعاملة الخاصة بهذا العميل..."
                      : "لا توجد معاملات مسجلة بعد لهذا العميل"
                    : "يرجى اختيار العميل أولاً"
                }
                value={transactionId || undefined}
                onChange={changeTransaction}
              />
            </div>
          </div>
        </CardComponent>

        {/* Content Area */}
        {clientId && selectedTransaction ? (
          <div className="space-y-6 animate-fade-in">
            {/* Transaction Header Card */}
            <CardComponent className="p-5 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedTransaction.title}
                    </h2>
                    <Tag
                      color={
                        selectedTransaction.status === "مكتملة"
                          ? "success"
                          : selectedTransaction.status === "ملغاة"
                          ? "error"
                          : "processing"
                      }
                      className="font-bold text-xs"
                    >
                      {selectedTransaction.status || "قيد التنفيذ"}
                    </Tag>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CalendarOutlined />
                      التاريخ: {dayjs(selectedTransaction.date).format("YYYY/MM/DD")}
                    </span>
                    <span>العميل: {client?.clientName}</span>
                    {selectedTransaction.notes && (
                      <span className="text-gray-400 truncate max-w-md">
                        ملاحظات: {selectedTransaction.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ButtonComponent
                    type="primary"
                    icon={<PrinterFilled />}
                    text="طباعة الفاتورة"
                    onClick={() => setOpenPrintModal(true)}
                    className="font-bold shadow-sm"
                  />
                  <ButtonComponent
                    icon={<EditFilled />}
                    text="تعديل المعاملة"
                    onClick={() => {
                      setEditingTransaction(selectedTransaction);
                      setTransactionModalOpen(true);
                    }}
                  />
                  <Tooltip title="حذف المعاملة">
                    <ButtonComponent
                      danger
                      icon={<DeleteFilled />}
                      onClick={handleDeleteCurrentTx}
                    />
                  </Tooltip>
                </div>
              </div>
            </CardComponent>

            {/* Financial Summary */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <StatCard
                  label="إجمالي المصروفات والتكاليف"
                  value={`${totalPayments.toLocaleString()} ج.م`}
                  icon={<ShoppingOutlined className="text-xl" />}
                  variant="danger"
                />
              </Col>
              <Col xs={24} sm={8}>
                <StatCard
                  label="إجمالي الدفعات المستلمة"
                  value={`${totalPatches.toLocaleString()} ج.م`}
                  icon={<DollarOutlined className="text-xl" />}
                  variant="success"
                />
              </Col>
              <Col xs={24} sm={8}>
                <StatCard
                  label={isCreditor ? "الصافي للعميل (دائن)" : "الصافي على العميل (مدين)"}
                  value={`${Math.abs(balance).toLocaleString()} ج.م`}
                  icon={<DollarOutlined className="text-xl" />}
                  variant={isCreditor ? "success" : "danger"}
                />
              </Col>
            </Row>

            {/* Expenses & Payments Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expenses Table */}
              <CardComponent className="p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingOutlined className="text-rose-500" />
                    المصروفات والتكاليف ({selectedTransaction.payments?.length || 0})
                  </h3>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400" dir="ltr">
                    {totalPayments.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-neutral-800 border border-gray-200/80 dark:border-neutral-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  {selectedTransaction.payments && selectedTransaction.payments.length > 0 ? (
                    selectedTransaction.payments.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 text-xs hover:bg-gray-50/50 dark:hover:bg-neutral-800/30">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{p.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {dayjs(p.date).format("YYYY/MM/DD")} {p.notes ? `• ${p.notes}` : ""}
                          </p>
                        </div>
                        <span className="font-black text-rose-600 dark:text-rose-400" dir="ltr">
                          {Number(p.price).toLocaleString()} ج.م
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="p-6 text-center text-xs text-gray-400">لا توجد بنود مصروفات مسجلة</p>
                  )}
                </div>
              </CardComponent>

              {/* Patches Table */}
              <CardComponent className="p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarOutlined className="text-emerald-500" />
                    الدفعات المستلمة ({selectedTransaction.patches?.length || 0})
                  </h3>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                    {totalPatches.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-neutral-800 border border-gray-200/80 dark:border-neutral-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  {selectedTransaction.patches && selectedTransaction.patches.length > 0 ? (
                    selectedTransaction.patches.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 text-xs hover:bg-gray-50/50 dark:hover:bg-neutral-800/30">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            دفعة مستلمة #{idx + 1}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {dayjs(p.date).format("YYYY/MM/DD")} {p.notes ? `• ${p.notes}` : ""}
                          </p>
                        </div>
                        <span className="font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                          {Number(p.amount).toLocaleString()} ج.م
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="p-6 text-center text-xs text-gray-400">لم تسجل دفعات مستلمة بعد</p>
                  )}
                </div>
              </CardComponent>
            </div>
          </div>
        ) : clientId && transactions.length > 0 ? (
          /* Client selected but no transaction chosen yet: display client's transactions quick list */
          <CardComponent className="p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  معاملات العميل: {client?.clientName}
                </h3>
                <p className="text-xs text-gray-500">
                  اختر معاملة من القائمة بالأعلى أو انقر على أي معاملة أدناه لعرض تفاصيلها وفاتورتها
                </p>
              </div>
              <ButtonComponent
                type="primary"
                icon={<PlusOutlined />}
                text="إضافة معاملة جديدة"
                onClick={() => {
                  setEditingTransaction(null);
                  setTransactionModalOpen(true);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactions.map((tx: Transaction) => {
                const totalPatches = Number(tx.totalPatches) || 0;
                const totalPayments = Number(tx.totalPayments) || 0;
                const txBal = totalPatches - totalPayments;
                const isCreditor = txBal >= 0;
                const isSelected = transactionId === tx._id;

                return (
                  <div
                    key={tx._id}
                    onClick={() => changeTransaction(tx._id)}
                    className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                        : "border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#161622] hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Top Row: Title, Code & Status */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <FileTextOutlined className="text-base" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                              #{tx.code || 1000}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tx.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <Tag
                        color={
                          tx.status === "مكتملة"
                            ? "success"
                            : tx.status === "ملغاة"
                            ? "error"
                            : "processing"
                        }
                        className="!m-0 !rounded-full !px-2.5 !py-0.5 text-xs font-bold shrink-0"
                      >
                        {tx.status || "قيد التنفيذ"}
                      </Tag>
                    </div>

                    {/* Date & Counts */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3.5 pb-3 border-b border-gray-100 dark:border-neutral-800/80">
                      <span className="flex items-center gap-1 font-medium">
                        <CalendarOutlined className="text-gray-400" />
                        {dayjs(tx.date).format("YYYY/MM/DD")}
                      </span>
                      <span>•</span>
                      <span>{tx.payments?.length || 0} مصروفات</span>
                      <span>•</span>
                      <span>{tx.patches?.length || 0} دفعات</span>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1f202b] border border-gray-100 dark:border-neutral-800 text-center">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-0.5">
                          المصروفات
                        </span>
                        <span className="font-black text-rose-600 dark:text-rose-400" dir="ltr">
                          {totalPayments.toLocaleString()} ج.م
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1f202b] border border-gray-100 dark:border-neutral-800 text-center">
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 block mb-0.5">
                          الدفعات
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                          {totalPatches.toLocaleString()} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Net Balance Footer */}
                    <div
                      className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs font-bold ${
                        isCreditor
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/50"
                          : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/50"
                      }`}
                    >
                      <span>{isCreditor ? "الصافي للعميل (له)" : "الصافي على العميل (عليه)"}:</span>
                      <span className="font-black text-sm" dir="ltr">
                        {Math.abs(txBal).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardComponent>
        ) : clientId ? (
          /* Client selected but no transactions exist yet */
          <CardComponent className="py-12 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-3">
              <FileTextOutlined className="text-4xl text-gray-300 dark:text-neutral-700" />
              <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                لا توجد معاملات مسجلة بعد لهذا العميل
              </p>
              <p className="text-xs text-gray-500 max-w-sm">
                يمكنك الآن بدء أول معاملة أو مشروع تشطيب لهذا العميل بضغطة زر واحدة
              </p>
              <ButtonComponent
                type="primary"
                icon={<PlusOutlined />}
                text="إضافة أول معاملة لهذا العميل"
                onClick={() => {
                  setEditingTransaction(null);
                  setTransactionModalOpen(true);
                }}
                className="mt-2 font-bold shadow-md"
              />
            </div>
          </CardComponent>
        ) : (
          /* No client selected */
          <CardComponent className="py-12 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 dark:text-gray-500">
              <UserOutlined className="text-4xl text-gray-300 dark:text-neutral-700" />
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
                يرجى اختيار العميل
              </p>
              <p className="text-sm max-w-md text-gray-500">
                اختر عميلاً من القائمة بالأعلى لعرض وإدارة كافة معاملاته ودفعاته ومصروفاته وطباعة فواتيره.
              </p>
            </div>
          </CardComponent>
        )}
      </div>
    </>
  );
};

export default PaymentsAndPatches;
