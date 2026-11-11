/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Flex, Row, Tooltip, Tag, Modal, Skeleton, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteAccountStatementApi,
  toggleAccountStatementStatusApi,
} from "../../apis/AccountStatementsApi";
import {
  getTransactionsByClientApi,
  deleteTransactionApi,
} from "../../apis/TransactionsApi";
import CardComponent from "../../components/CardComponent";
import TableComponent from "../../components/TableComponent";
import ButtonComponent from "../../components/ButtonComponent";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
  DollarOutlined,
  EditFilled,
  EnvironmentOutlined,
  FileTextOutlined,
  IdcardOutlined,
  PhoneOutlined,
  PlusOutlined,
  PrinterFilled,
  ShoppingOutlined,
  StopOutlined,
  EyeOutlined,
  SearchOutlined,
  WhatsAppOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import ModalComponent from "../../components/ModalComponent";
import PrintContent from "../../components/PrintContent";
import PrintTransactionInvoice from "../../components/PrintTransactionInvoice";
import AddEditTransactionModal from "../../components/AddEditTransactionModal";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Transaction } from "../../types";
import {
  exportTransactionToExcel,
  exportFullStatementToExcel,
} from "../../utils/exportExcel";
import {
  sendTransactionViaWhatsApp,
  downloadInvoicePDF,
} from "../../utils/invoiceShare";

export const AccountStatementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { confirm, contextHolder } = useConfirmDialog();

  // Print refs & states
  const statementPrintRef = useRef<HTMLDivElement>(null);
  const invoicePrintRef = useRef<HTMLDivElement>(null);
  const modalInvoiceRef = useRef<HTMLDivElement>(null);
  const [openStatementPrintModal, setOpenStatementPrintModal] = useState(false);
  const [openInvoicePrintModal, setOpenInvoicePrintModal] = useState(false);

  // Transactions state
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedTransactionForPrint, setSelectedTransactionForPrint] = useState<Transaction | null>(null);
  const [viewTransactionDetails, setViewTransactionDetails] = useState<Transaction | null>(null);

  // Print full statement handler
  const printStatementFn = useReactToPrint({
    contentRef: statementPrintRef,
    documentTitle: "كشف حساب العميل",
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

  // Print single transaction invoice handler
  const printInvoiceFn = useReactToPrint({
    contentRef: invoicePrintRef,
    documentTitle: `فاتورة-${selectedTransactionForPrint?.title || "معاملة"}`,
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

  // Query: client data and all their transactions
  const { data, isLoading } = useQuery(
    ["clientTransactions", id],
    () => getTransactionsByClientApi(id as string),
    { enabled: Boolean(id) }
  );

  const client = data?.client;
  const transactions = data?.transactions || [];
  const summary = data?.summary || {
    totalTransactions: 0,
    grandTotalPatches: 0,
    grandTotalPayments: 0,
    grandBalance: 0,
    isCreditor: false,
  };

  useEffect(() => {
    if (client?.clientName) {
      document.title = `شطب - كشف حساب: ${client.clientName}`;
    }
  }, [client?.clientName]);

  const [searchText, setSearchText] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchText.trim()) return transactions;
    const q = searchText.trim().toLowerCase();
    return transactions.filter((t: Transaction) => {
      const titleMatch = t.title?.toLowerCase().includes(q);
      const notesMatch = t.notes?.toLowerCase().includes(q);
      const statusMatch = t.status?.toLowerCase().includes(q);
      const codeMatch = String(t.code || "").includes(q);
      const dateMatch = dayjs(t.date).format("YYYY/MM/DD").includes(q);
      return titleMatch || notesMatch || statusMatch || codeMatch || dateMatch;
    });
  }, [transactions, searchText]);

  // Delete transaction mutation
  const { mutate: deleteTransactionMutate } = useMutation(
    (txId: string) => deleteTransactionApi(txId),
    {
      onSuccess: () => {
        toast.success("تم حذف المعاملة بنجاح");
        queryClient.invalidateQueries(["clientTransactions", id]);
        queryClient.invalidateQueries(["accountStatements"]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف المعاملة");
      },
    }
  );

  // Delete client mutation
  const { mutate: deleteAccountStatement, isLoading: loadingDelete } =
    useMutation(deleteAccountStatementApi, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "تم حذف كشف الحساب بنجاح");
        navigate("/account-statement");
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف كشف الحساب");
      },
    });

  // Toggle client active status mutation
  const { mutate: toggleStatusMutate, isLoading: loadingToggleStatus } =
    useMutation(() => toggleAccountStatementStatusApi(id as string), {
      onSuccess: (res: any) => {
        toast.success(res?.message || "تم تغيير حالة كشف الحساب بنجاح");
        queryClient.invalidateQueries(["clientTransactions", id]);
        queryClient.invalidateQueries(["accountStatements"]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء تغيير حالة كشف الحساب");
      },
    });

  const handleToggleStatus = () => {
    const isDeactivating = client?.isActive !== false;
    confirm({
      title: isDeactivating ? "تأكيد تعطيل كشف الحساب" : "تأكيد تفعيل كشف الحساب",
      content: isDeactivating
        ? `هل تريد بالتأكيد تعطيل كشف حساب العميل "${client?.clientName}"؟ لن يظهر هذا العميل في قائمة اختيار العملاء في إدارة المصروفات والمدفوعات إلى حين إعادة تفعيله.`
        : `هل تريد بالتأكيد إعادة تفعيل كشف حساب العميل "${client?.clientName}"؟ سيظهر العميل مجدداً في إدارة المصروفات والمدفوعات.`,
      okText: isDeactivating ? "تعطيل الحساب" : "تفعيل الحساب",
      cancelText: "إلغاء",
      onConfirm: () => {
        toggleStatusMutate();
      },
    });
  };

  const handleDeleteClient = () => {
    confirm({
      title: "تأكيد حذف كشف الحساب",
      content: `هل أنت متأكد من رغبتك في حذف كشف حساب العميل "${client?.clientName}" وجميع معاملاته نهائياً؟`,
      okText: "نعم، احذف كشف الحساب",
      cancelText: "إلغاء",
      onConfirm: () => {
        if (id) deleteAccountStatement(id);
      },
    });
  };

  const handleDeleteTransaction = (tx: Transaction) => {
    confirm({
      title: "تأكيد حذف المعاملة",
      content: `هل أنت متأكد من حذف معاملة "${tx.title}"؟ سيتم حذف جميع الدفعات والمصروفات المرتبطة بها.`,
      okText: "نعم، احذف المعاملة",
      cancelText: "إلغاء",
      onConfirm: () => {
        if (tx._id) deleteTransactionMutate(tx._id);
      },
    });
  };

  const handleOpenAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionModalOpen(true);
  };

  const handleOpenEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionModalOpen(true);
  };

  const handlePrintTransaction = (tx: Transaction) => {
    setSelectedTransactionForPrint(tx);
    setOpenInvoicePrintModal(true);
  };

  const handleTransactionSuccess = (savedTx: Transaction, shouldPrint?: boolean) => {
    queryClient.invalidateQueries(["clientTransactions", id]);
    queryClient.invalidateQueries(["accountStatements"]);

    if (shouldPrint) {
      setSelectedTransactionForPrint(savedTx);
      setOpenInvoicePrintModal(true);
      setTimeout(() => {
        printInvoiceFn();
      }, 400);
    }
  };

  // Columns for the Transactions Table
  const transactionsColumns = [
    {
      title: "كود المعاملة",
      dataIndex: "code",
      key: "code",
      width: 110,
      render: (c: number, _: any, index: number) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-lg text-xs">
          #{c || 1000 + index}
        </span>
      ),
    },
    {
      title: "اسم المعاملة / الخدمة / الشقة",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Transaction) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-sm hover:text-blue-600 cursor-pointer"
            onClick={() => setViewTransactionDetails(record)}
          >
            {text}
          </p>
          {record.notes && (
            <p className="text-xs text-gray-400 truncate max-w-xs">{record.notes}</p>
          )}
        </div>
      ),
    },
    {
      title: "تاريخ المعاملة",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (d: string) => (
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {dayjs(d).format("YYYY/MM/DD")}
        </span>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s: string) => {
        const color =
          s === "مكتملة" ? "success" : s === "ملغاة" ? "error" : "processing";
        return <Tag color={color} className="font-semibold">{s || "قيد التنفيذ"}</Tag>;
      },
    },
    {
      title: "المصروفات والتكاليف",
      dataIndex: "totalPayments",
      key: "totalPayments",
      render: (val: number, record: Transaction) => (
        <div className="text-left font-bold text-rose-600 dark:text-rose-400" dir="ltr">
          <span>{Number(val || 0).toLocaleString()} ج.م</span>
          <span className="text-[10px] text-gray-400 block font-normal">
            ({record.payments?.length || 0} بند)
          </span>
        </div>
      ),
    },
    {
      title: "الدفعات المستلمة",
      dataIndex: "totalPatches",
      key: "totalPatches",
      render: (val: number, record: Transaction) => (
        <div className="text-left font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
          <span>{Number(val || 0).toLocaleString()} ج.م</span>
          <span className="text-[10px] text-gray-400 block font-normal">
            ({record.patches?.length || 0} دفعة)
          </span>
        </div>
      ),
    },
    {
      title: "صافي المعاملة",
      key: "balance",
      render: (_: any, record: Transaction) => {
        const bal = (record.totalPatches || 0) - (record.totalPayments || 0);
        const isCred = bal >= 0;
        return (
          <div
            className={`font-black text-xs px-2.5 py-1 rounded-xl inline-block ${
              isCred
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
            }`}
            dir="ltr"
          >
            {Math.abs(bal).toLocaleString()} ج.م {isCred ? "(له)" : "(عليه)"}
          </div>
        );
      },
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 220,
      render: (_: any, record: Transaction) => (
        <div className="flex items-center gap-1">
          <Tooltip title="طباعة فاتورة المعاملة">
            <button
              type="button"
              onClick={() => handlePrintTransaction(record)}
              aria-label="طباعة فاتورة المعاملة"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
            >
              <PrinterFilled className="text-base" />
            </button>
          </Tooltip>

          <Tooltip title="إرسال ملخص الفاتورة واتساب">
            <button
              type="button"
              onClick={() => sendTransactionViaWhatsApp(record, client)}
              aria-label="إرسال ملخص الفاتورة واتساب"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
            >
              <WhatsAppOutlined className="text-base" />
            </button>
          </Tooltip>

          <Tooltip title="تصدير الفاتورة إكسيل">
            <button
              type="button"
              onClick={() => exportTransactionToExcel(record, client)}
              aria-label="تصدير الفاتورة إكسيل"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
            >
              <FileExcelOutlined className="text-base" />
            </button>
          </Tooltip>

          <Tooltip title="عرض التفاصيل">
            <button
              type="button"
              onClick={() => setViewTransactionDetails(record)}
              aria-label="عرض التفاصيل"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <EyeOutlined className="text-base" />
            </button>
          </Tooltip>

          <Tooltip title="تعديل المعاملة">
            <button
              type="button"
              onClick={() => handleOpenEditTransaction(record)}
              aria-label="تعديل المعاملة"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
            >
              <EditFilled className="text-base" />
            </button>
          </Tooltip>

          <Tooltip title="حذف المعاملة">
            <button
              type="button"
              onClick={() => handleDeleteTransaction(record)}
              aria-label="حذف المعاملة"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <DeleteFilled className="text-base" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      {/* Hidden printable components */}
      <div style={{ display: "none" }}>
        {client && (
          <PrintContent
            ref={statementPrintRef}
            client={{
              ...client,
              patches: transactions.flatMap((t) => t.patches || []),
              payments: transactions.flatMap((t) => t.payments || []),
              totalPatches: summary.grandTotalPatches,
              totalPayments: summary.grandTotalPayments,
              creditor: summary.grandBalance > 0 ? summary.grandBalance : 0,
              debtor: summary.grandBalance < 0 ? Math.abs(summary.grandBalance) : 0,
            }}
          />
        )}

        {selectedTransactionForPrint && client && (
          <PrintTransactionInvoice
            ref={invoicePrintRef}
            transaction={selectedTransactionForPrint}
            client={client}
          />
        )}
      </div>

      {/* Modal: Add or Edit Transaction */}
      {client && transactionModalOpen && (
        <AddEditTransactionModal
          key={`tx-modal-${id}-${editingTransaction?._id || "new"}`}
          visible={transactionModalOpen}
          onClose={() => {
            setTransactionModalOpen(false);
            setEditingTransaction(null);
          }}
          accountStatementId={id as string}
          clientName={client?.clientName || ""}
          editingTransaction={editingTransaction}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {/* Modal: View Transaction Details Preview */}
      <Modal
        open={Boolean(viewTransactionDetails)}
        onCancel={() => setViewTransactionDetails(null)}
        footer={null}
        width={750}
        centered
        className="font-cairo"
        title={
          <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
            <FileTextOutlined className="text-blue-500" />
            <span>تفاصيل المعاملة: {viewTransactionDetails?.title}</span>
          </div>
        }
      >
        {viewTransactionDetails && (
          <div dir="rtl" className="space-y-5 pt-3">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-[#1a1a1f] p-3.5 rounded-2xl border border-gray-200 dark:border-neutral-800 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#242429] border border-gray-200/60 dark:border-neutral-700/60">
                <span className="text-gray-500 dark:text-gray-400 block mb-1 font-semibold">تاريخ المعاملة</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {dayjs(viewTransactionDetails.date).format("YYYY/MM/DD")}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#242429] border border-gray-200/60 dark:border-neutral-700/60">
                <span className="text-gray-500 dark:text-gray-400 block mb-1 font-semibold">حالة المعاملة</span>
                <Tag
                  color={
                    viewTransactionDetails.status === "مكتملة"
                      ? "success"
                      : viewTransactionDetails.status === "ملغاة"
                      ? "error"
                      : "processing"
                  }
                  className="font-bold"
                >
                  {viewTransactionDetails.status || "قيد التنفيذ"}
                </Tag>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#242429] border border-gray-200/60 dark:border-neutral-700/60">
                <span className="text-gray-500 dark:text-gray-400 block mb-1 font-semibold">إجمالي المصروفات</span>
                <span className="font-black text-rose-600 dark:text-rose-400" dir="ltr">
                  {Number(viewTransactionDetails.totalPayments || 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#242429] border border-gray-200/60 dark:border-neutral-700/60">
                <span className="text-gray-500 dark:text-gray-400 block mb-1 font-semibold">إجمالي الدفعات</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                  {Number(viewTransactionDetails.totalPatches || 0).toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* Notes if present */}
            {viewTransactionDetails.notes && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
                <span className="font-bold ml-1">ملاحظات المعاملة:</span>
                {viewTransactionDetails.notes}
              </div>
            )}

            {/* Expenses List */}
            <div className="bg-white dark:bg-[#1a1a1f] p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xs">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <ShoppingOutlined className="text-rose-500" />
                  المصروفات والتكاليف
                </h4>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  {viewTransactionDetails.payments?.length || 0} بند
                </span>
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800 border border-gray-200/80 dark:border-neutral-800 rounded-xl">
                {viewTransactionDetails.payments && viewTransactionDetails.payments.length > 0 ? (
                  viewTransactionDetails.payments.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 text-xs hover:bg-gray-50/50 dark:hover:bg-neutral-800/30">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-white">
                            {p.name}
                          </span>
                          {p.notes && <span className="text-gray-400 text-[11px] block">{p.notes}</span>}
                        </div>
                      </div>
                      <span className="font-black text-rose-600 dark:text-rose-400" dir="ltr">
                        {Number(p.price).toLocaleString()} ج.م
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-gray-400">لا توجد مصروفات مسجلة لهذه المعاملة</p>
                )}
              </div>
            </div>

            {/* Patches List */}
            <div className="bg-white dark:bg-[#1a1a1f] p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xs">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <DollarOutlined className="text-emerald-500" />
                  الدفعات المستلمة
                </h4>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {viewTransactionDetails.patches?.length || 0} دفعة
                </span>
              </div>
              <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 dark:divide-neutral-800 border border-gray-200/80 dark:border-neutral-800 rounded-xl">
                {viewTransactionDetails.patches && viewTransactionDetails.patches.length > 0 ? (
                  viewTransactionDetails.patches.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 text-xs hover:bg-gray-50/50 dark:hover:bg-neutral-800/30">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-white">
                            دفعة بتاريخ {dayjs(p.date).format("YYYY/MM/DD")}
                          </span>
                          {p.notes && <span className="text-gray-400 text-[11px] block">({p.notes})</span>}
                        </div>
                      </div>
                      <span className="font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                        {Number(p.amount).toLocaleString()} ج.م
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-xs text-gray-400">لا توجد دفعات مستلمة لهذه المعاملة</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-neutral-800">
              <ButtonComponent
                type="primary"
                icon={<PrinterFilled />}
                text="طباعة فاتورة المعاملة"
                onClick={() => {
                  setViewTransactionDetails(null);
                  handlePrintTransaction(viewTransactionDetails);
                }}
                className="font-bold shadow-sm"
              />
              <ButtonComponent text="إغلاق" onClick={() => setViewTransactionDetails(null)} />
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Single Transaction Invoice Print Preview */}
      <ModalComponent
        width={850}
        style={{ maxWidth: "calc(100vw - 20px)", margin: "10px auto" }}
        className="!max-w-[calc(100vw-20px)]"
        title={
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold truncate">
            <PrinterFilled className="text-blue-500 shrink-0" />
            <span className="truncate">معاينة طباعة الفاتورة: {selectedTransactionForPrint?.title}</span>
          </div>
        }
        open={openInvoicePrintModal}
        onCancel={() => setOpenInvoicePrintModal(false)}
        footer={
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <ButtonComponent
                icon={<WhatsAppOutlined />}
                text="مشاركة عبر واتساب"
                onClick={() =>
                  sendTransactionViaWhatsApp(
                    selectedTransactionForPrint!,
                    client
                  )
                }
                className="btn-whatsapp font-bold shadow-xs flex-1 sm:flex-none text-xs sm:text-sm"
              />
              <ButtonComponent
                icon={<FileExcelOutlined />}
                text="تصدير إكسيل"
                onClick={() =>
                  exportTransactionToExcel(
                    selectedTransactionForPrint!,
                    client
                  )
                }
                className="btn-excel font-bold flex-1 sm:flex-none text-xs sm:text-sm"
              />
              <ButtonComponent
                icon={<DownloadOutlined />}
                text="تحميل PDF"
                onClick={() =>
                  downloadInvoicePDF(
                    modalInvoiceRef.current || invoicePrintRef.current,
                    `فاتورة-${selectedTransactionForPrint?.title || "معاملة"}`
                  )
                }
                className="font-bold flex-1 sm:flex-none text-xs sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <ButtonComponent
                text="إلغاء"
                onClick={() => setOpenInvoicePrintModal(false)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              />
              <ButtonComponent
                type="primary"
                icon={<PrinterFilled />}
                text="طباعة الفاتورة الآن"
                onClick={() => printInvoiceFn()}
                className="font-bold shadow-sm flex-1 sm:flex-none text-xs sm:text-sm"
              />
            </div>
          </div>
        }
      >
        {selectedTransactionForPrint && client && (
          <div className="max-h-[75vh] overflow-y-auto border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 p-2">
            <PrintTransactionInvoice
              ref={modalInvoiceRef}
              transaction={selectedTransactionForPrint}
              client={client}
            />
          </div>
        )}
      </ModalComponent>

      {/* Modal: Full Account Statement Print Preview */}
      <ModalComponent
        width={850}
        style={{ maxWidth: "calc(100vw - 20px)", margin: "10px auto" }}
        className="!max-w-[calc(100vw-20px)]"
        title={
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold truncate">
            <PrinterFilled className="text-blue-500 shrink-0" />
            <span className="truncate">معاينة كشف الحساب الشامل: {client?.clientName}</span>
          </div>
        }
        open={openStatementPrintModal}
        onCancel={() => setOpenStatementPrintModal(false)}
        footer={
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 w-full">
            <ButtonComponent
              icon={<FileExcelOutlined />}
              text="تصدير كشف الحساب إكسيل"
              onClick={() =>
                exportFullStatementToExcel(client!, transactions, summary)
              }
              className="btn-excel font-bold text-xs sm:text-sm w-full sm:w-auto"
            />
            <div className="flex items-center gap-2">
              <ButtonComponent
                text="إلغاء"
                onClick={() => setOpenStatementPrintModal(false)}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              />
              <ButtonComponent
                type="primary"
                icon={<PrinterFilled />}
                text="طباعة كشف الحساب"
                onClick={() => printStatementFn()}
                className="font-bold shadow-sm flex-1 sm:flex-none text-xs sm:text-sm"
              />
            </div>
          </div>
        }
      >
        {client && (
          <div className="max-h-[75vh] overflow-y-auto border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 p-2">
            <PrintContent
              showPrintContent={true}
              client={{
                ...client,
                patches: transactions.flatMap((t) => t.patches || []),
                payments: transactions.flatMap((t) => t.payments || []),
                totalPatches: summary.grandTotalPatches,
                totalPayments: summary.grandTotalPayments,
                creditor: summary.grandBalance > 0 ? summary.grandBalance : 0,
                debtor: summary.grandBalance < 0 ? Math.abs(summary.grandBalance) : 0,
              }}
            />
          </div>
        )}
      </ModalComponent>

      {/* Page Content */}
      <div className="space-y-6 animate-fade-in font-cairo">
        {isLoading ? (
          /* Skeleton Loader when fetching client and transaction details */
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151c] border border-gray-200 dark:border-neutral-800 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton.Input active size="large" style={{ width: 280, height: 32 }} />
                  <Skeleton.Input active size="small" style={{ width: 180, height: 20 }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton.Button active size="large" style={{ width: 180, borderRadius: 12 }} />
                  <Skeleton.Button active size="large" style={{ width: 140, borderRadius: 12 }} />
                  <Skeleton.Button active size="large" style={{ width: 44, borderRadius: 12 }} />
                  <Skeleton.Button active size="large" style={{ width: 44, borderRadius: 12 }} />
                </div>
              </div>
            </div>

            {/* Stat Cards Skeletons */}
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4].map((i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#15151c] border border-gray-200 dark:border-neutral-800 shadow-xs space-y-3">
                    <Skeleton.Input active size="small" style={{ width: 110, height: 16 }} />
                    <Skeleton.Input active size="large" style={{ width: 150, height: 32 }} />
                  </div>
                </Col>
              ))}
            </Row>

            {/* Client Profile Skeleton */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#15151c] border border-gray-200 dark:border-neutral-800 shadow-xs">
              <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((i) => (
                  <Col xs={24} sm={12} lg={6} key={i}>
                    <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800 space-y-2">
                      <Skeleton.Input active size="small" style={{ width: 80, height: 14 }} />
                      <Skeleton.Input active size="small" style={{ width: 130, height: 20 }} />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Transactions Table Skeleton */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151c] border border-gray-200 dark:border-neutral-800 shadow-xs">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>
        ) : (
          <>
            {/* Page Header */}
            <PageHeader
              title={
                <div className="flex items-center gap-3 flex-wrap">
                  <span>{`كشف حساب: ${client?.clientName || "..."}`}</span>
                  {client?.isActive === false ? (
                    <Tag
                      color="default"
                      className="text-xs px-2.5 py-0.5 rounded-full font-bold border-gray-400 text-gray-500"
                    >
                      حساب معطل
                    </Tag>
                  ) : (
                    <Tag
                      color="success"
                      className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                    >
                      حساب نشط
                    </Tag>
                  )}
                </div>
              }
              subtitle={`كود العميل #${client?.code || "—"} • سجل الحساب والمعاملات`}
              icon={<IdcardOutlined />}
              extra={
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
                  <ButtonComponent
                    type="primary"
                    icon={<PlusOutlined />}
                    text="إضافة معاملة جديدة"
                    onClick={handleOpenAddTransaction}
                    className="font-bold shadow-sm flex-1 sm:flex-none text-xs sm:text-sm"
                  />

                  <ButtonComponent
                    icon={<PrinterFilled />}
                    text="طباعة كشف الحساب"
                    onClick={() => setOpenStatementPrintModal(true)}
                    className="shadow-xs font-semibold flex-1 sm:flex-none text-xs sm:text-sm"
                  />

                  <Tooltip
                    title={
                      client?.isActive === false
                        ? "إعادة تفعيل كشف الحساب ليظهر في قائمة إدارة المصروفات"
                        : "تعطيل كشف الحساب لإخفائه من قائمة إدارة المصروفات"
                    }
                  >
                    <ButtonComponent
                      icon={
                        client?.isActive === false ? (
                          <CheckCircleOutlined />
                        ) : (
                          <StopOutlined />
                        )
                      }
                      text={
                        client?.isActive === false
                          ? "تفعيل الحساب"
                          : "تعطيل الحساب"
                      }
                      className={
                        client?.isActive === false
                          ? "!border-emerald-500 !text-emerald-600 hover:!bg-emerald-50 dark:hover:!bg-emerald-950/30 font-bold shadow-xs flex-1 sm:flex-none text-xs sm:text-sm"
                          : "!border-amber-500/80 !text-amber-600 hover:!bg-amber-50 dark:hover:!bg-amber-950/30 font-bold shadow-xs flex-1 sm:flex-none text-xs sm:text-sm"
                      }
                      loading={loadingToggleStatus}
                      onClick={handleToggleStatus}
                    />
                  </Tooltip>

                  <div className="flex items-center gap-1.5 border-s border-gray-200 dark:border-neutral-800 ps-2">
                    <Tooltip title="تعديل بيانات العميل">
                      <ButtonComponent
                        icon={<EditFilled />}
                        onClick={() => navigate(`/account-statement/edit-account/${id}`)}
                        className="!w-9 !h-9 !p-0 rounded-xl"
                      />
                    </Tooltip>

                    <Tooltip title="حذف كشف الحساب">
                      <ButtonComponent
                        danger
                        icon={<DeleteFilled />}
                        loading={loadingDelete}
                        onClick={handleDeleteClient}
                        className="!w-9 !h-9 !p-0 rounded-xl"
                      />
                    </Tooltip>
                  </div>
                </div>
              }
            />

            {/* Financial Stat Cards (Summary across all transactions) */}
            <Row gutter={[12, 12]}>
              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="إجمالي المعاملات"
                  value={`${summary.totalTransactions} معاملة`}
                  icon={<FileTextOutlined className="text-xl" />}
                  variant="default"
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="إجمالي المقبوضات (الدفعات)"
                  value={`${Number(summary.grandTotalPatches || 0).toLocaleString()} ج.م`}
                  icon={<DollarOutlined className="text-xl" />}
                  variant="success"
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label="إجمالي المصروفات والتكاليف"
                  value={`${Number(summary.grandTotalPayments || 0).toLocaleString()} ج.م`}
                  icon={<ShoppingOutlined className="text-xl" />}
                  variant="danger"
                />
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <StatCard
                  label={summary.isCreditor ? "الرصيد المتبقي له (دائن)" : "المبلغ المتبقي عليه (مدين)"}
                  value={`${Number(Math.abs(summary.grandBalance || 0)).toLocaleString()} ج.م`}
                  icon={
                    summary.isCreditor ? (
                      <CheckCircleOutlined className="text-xl text-emerald-500" />
                    ) : (
                      <CloseCircleOutlined className="text-xl text-rose-500" />
                    )
                  }
                  variant={summary.isCreditor ? "success" : "danger"}
                />
              </Col>
            </Row>

            {/* Client Profile Info Card */}
            <CardComponent className="p-4 shadow-sm">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                    <IdcardOutlined className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">اسم العميل</p>
                      <p className="font-bold text-gray-900 dark:text-white">{client?.clientName || "—"}</p>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                    <PhoneOutlined className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">رقم الهاتف</p>
                      <p className="font-bold text-gray-900 dark:text-white font-mono" dir="ltr">
                        {client?.phoneNumber || "—"}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                    <CalendarOutlined className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">تاريخ فتح الحساب</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {client?.date ? dayjs(client.date).format("YYYY/MM/DD") : "—"}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
                    <EnvironmentOutlined className="text-blue-500 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">العنوان</p>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {client?.address || "—"}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardComponent>

            {/* Transactions & Invoices Section with Search */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileTextOutlined className="text-blue-500" />
                    قائمة المعاملات والفواتير
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {searchText.trim()
                      ? `${filteredTransactions.length} من أصل ${transactions.length} معاملة`
                      : `${transactions.length} معاملة مسجلة`}
                  </span>
                </div>

                <div className="w-full sm:w-80">
                  <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="بحث باسم المعاملة، التاريخ، الحالة..."
                    allowClear
                    size="large"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="!rounded-xl"
                  />
                </div>
              </div>

              <TableComponent
                columns={transactionsColumns}
                rowKey="_id"
                dataSource={filteredTransactions}
                showPagination={filteredTransactions.length > 10}
                loading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AccountStatementDetails;
