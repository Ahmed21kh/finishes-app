/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, InputNumber, Tooltip } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteFilled,
  DollarOutlined,
  EditFilled,
  FileTextOutlined,
  PlusOutlined,
  PrinterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import SkeletonComponent from "../../components/SkeletonComponent";
import EmptyComponent from "../../components/EmptyComponent";
import ModalComponent from "../../components/ModalComponent";
import FilterComponent from "../../components/FilterComponent";
import PrintContent from "../../components/PrintContent";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { deleteinvoiceApi, getAllinvoices } from "../../apis/InvoicesApi";
import { toast } from "react-toastify";
import moment from "moment";
import { AppContext } from "../../context/AppContext";
import { useReactToPrint } from "react-to-print";
import { getOneAccountStatementApi } from "../../apis/AccountStatementsApi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export interface InvoicesPageProps {
  apartmentId?: string;
  clientId?: string;
}

export const InvoicesPage = ({ clientId, apartmentId }: InvoicesPageProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { primaryColor } = useContext(AppContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const { confirm, contextHolder } = useConfirmDialog();

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: "فاتورة أعمال وتشطيبات",
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

  const [paymentsData, setPaymentsData] = useState<any[]>([]);
  const [paymentsDataFilter, setPaymentsDataFilter] = useState<any[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<string>("");
  const [printType, setPrintType] = useState<"invoice" | "statement">("invoice");
  const [totalPatch, setTotalPatch] = useState<number>(0);
  const [totalRemainPatch, setTotalRemainPatch] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  moment.locale("ar");

  const searchFilter = yup.object().shape({
    name: yup.string().notRequired(),
    code: yup.string().notRequired(),
    price: yup.number().notRequired(),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(searchFilter),
  });

  const fetchInvoices = ({ queryKey }: any) => {
    const [, [, cId, aId]] = queryKey;
    const params = {
      page: 1,
      limit: 1000,
      client: cId,
      apartment: aId,
    };
    return getAllinvoices(params);
  };

  const fetchClient = ({ queryKey }: any) => {
    const [, cId] = queryKey;
    return getOneAccountStatementApi(cId);
  };

  const { data, isLoading } = useQuery(
    ["invoices", [{ page: 1, limit: 1000 }, clientId, apartmentId]],
    fetchInvoices,
    { enabled: Boolean(clientId && apartmentId) }
  );

  const { data: clientData } = useQuery(["client", clientId], fetchClient, {
    enabled: Boolean(clientId),
  });

  const { mutate: deleteInvoice, isLoading: loadingDelete } = useMutation(
    deleteinvoiceApi,
    {
      onSuccess: (resData) => {
        toast.success(resData?.message || "تم حذف الدفعة بنجاح");
        queryClient.invalidateQueries([
          "invoices",
          [{ page: 1, limit: 1000 }, clientId, apartmentId],
        ]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف الدفعة");
      },
    }
  );

  const calculateTotal = (item: any) => {
    setTotalPatch(Number(item?.payedPatch) || 0);
    setTotalPayment(Number(item?.totalPrice) || 0);
    setTotalRemainPatch(Number(item?.remainingAmount) || 0);
  };

  const resetData = () => {
    if (data?.data && data.data.length > 0) {
      const firstItem = data.data[0];
      const items = firstItem?.items || [];
      setPaymentsData(items);
      setPaymentsDataFilter(items);
      setActiveInvoice(firstItem?._id);
      calculateTotal(firstItem);
    } else {
      setPaymentsData([]);
      setPaymentsDataFilter([]);
      setActiveInvoice("");
      setTotalPatch(0);
      setTotalPayment(0);
      setTotalRemainPatch(0);
    }
  };

  useEffect(() => {
    if (data) {
      resetData();
    }
  }, [data, clientId, apartmentId]);

  const handleSelectInvoice = (item: any) => {
    setPaymentsData(item?.items || []);
    setPaymentsDataFilter(item?.items || []);
    setActiveInvoice(item?._id);
    calculateTotal(item);
  };

  const selectedInvoiceObj = data?.data?.find(
    (item: any) => item?._id === activeInvoice
  );

  const handleEdit = (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    navigate(
      `/account-statement/${clientId}/apartment/${apartmentId}/edit-invoice/${id}`
    );
  };

  const handleDelete = (e: React.MouseEvent, id: any) => {
    e.stopPropagation();
    confirm({
      title: "هل أنت متأكد من حذف هذه الدفعة؟",
      content: "سيتم حذف هذه الدفعة وجميع البنود المدرجة بداخلها.",
      okText: "حذف نهائي",
      cancelText: "إلغاء",
      loading: loadingDelete,
      onConfirm: () => {
        deleteInvoice(id);
      },
    });
  };

  const handleFilter = (search: any) => {
    ["code", "price"].forEach((key) => {
      if (search[key]) {
        search[key] = Number(search[key]);
      }
    });

    const filtered = paymentsData.filter((item: any) =>
      Object.entries(search).every(([key, value]) => {
        if (!value) return true;
        if (key === "name") {
          return item[key]
            ?.toLowerCase()
            ?.includes((value as string).trim().toLowerCase());
        }
        return item[key] === value;
      })
    );
    setPaymentsDataFilter(filtered);
  };

  const resetFilter = () => {
    reset();
    setPaymentsDataFilter(paymentsData);
  };

  const handlePrint = () => {
    reactToPrintFn();
    setOpenPrintDialog(false);
  };

  const openInvoicePrint = () => {
    setPrintType("invoice");
    setOpenPrintDialog(true);
  };

  const openStatementPrint = () => {
    setPrintType("statement");
    setOpenPrintDialog(true);
  };

  const columns = [
    {
      title: "رقم التسلسل",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (code: any) => (
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          #{code}
        </span>
      ),
    },
    {
      title: "اسم الصنف",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <span className="font-semibold">{name}</span>,
    },
    {
      title: "سعر الصنف",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => (
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {record?.price} ج
        </span>
      ),
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: any) => (
        <span className="text-gray-600 dark:text-gray-400">
          {moment(record?.date).format("DD/MM/YYYY - h:mm A")}
        </span>
      ),
    },
    {
      title: "ملاحظات",
      dataIndex: "itemNotes",
      key: "itemNotes",
      render: (_: any, record: any) => (
        <span className="text-gray-500 dark:text-gray-400">
          {record?.itemNotes || "لا توجد ملاحظات"}
        </span>
      ),
    },
  ];

  const inputsArr = [
    {
      name: "code",
      render: (field: any) => (
        <InputNumber
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.code ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث بكود الصنف"
          {...field}
        />
      ),
      xs: 24,
      lg: 7,
    },
    {
      name: "name",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.name ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث باسم الصنف"
          {...field}
        />
      ),
      xs: 24,
      lg: 7,
    },
    {
      name: "price",
      render: (field: any) => (
        <InputNumber
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.price ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث بسعر الصنف"
          {...field}
        />
      ),
      xs: 24,
      lg: 7,
    },
  ];

  return (
    <>
      {contextHolder}

      {/* Print Modal */}
      <ModalComponent
        centered
        title={
          printType === "invoice"
            ? "معاينة طباعة الفاتورة"
            : "معاينة كشف الحساب الشامل"
        }
        width={950}
        open={openPrintDialog}
        onCancel={() => setOpenPrintDialog(false)}
        footer={[
          <ButtonComponent
            key="cancel"
            text="إلغاء"
            onClick={() => setOpenPrintDialog(false)}
          />,
          <ButtonComponent
            key="print"
            type="primary"
            icon={<PrinterFilled />}
            text="بدء الطباعة"
            onClick={handlePrint}
          />,
        ]}
      >
        <div className="bg-white text-gray-900 border border-gray-200 rounded-xl p-4 max-h-[75vh] overflow-y-auto">
          <PrintContent
            showPrintContent={true}
            ref={contentRef}
            client={clientData}
            invoice={printType === "invoice" ? selectedInvoiceObj : undefined}
          />
        </div>
      </ModalComponent>

      <div className="space-y-6 animate-fade-in">
        {/* Section Header: Invoices/Patches */}
        <PageHeader
          title="الدفعات المالية"
          subtitle="اختر دفعة لعرض بنود المصروفات والتفاصيل الخاصة بها"
          icon={<DollarOutlined />}
          extra={
            <ButtonComponent
              disabled={!clientId || !apartmentId}
              type="primary"
              size="large"
              text="إضافة دفعة جديدة"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(
                  `/account-statement/${clientId}/apartment/${apartmentId}/add-invoice`
                )
              }
              className="shadow-sm font-semibold"
            />
          }
        />

        {/* Invoice selection cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Boolean(apartmentId && clientId && data?.data?.length && !isLoading) ? (
            data.data.map((item: any, i: number) => {
              const isSelected = activeInvoice === item?._id;
              return (
                <div
                  key={item?._id || i}
                  onClick={() => handleSelectInvoice(item)}
                  className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 border text-center ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20"
                      : "border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-neutral-700 hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 mb-3">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      دفعة #{item?.code || i + 1}
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {item?.payedPatch} ج
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CalendarOutlined />
                      {moment(item?.date).format("DD/MM/YYYY")}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
                    <Tooltip title="تعديل الدفعة">
                      <ButtonComponent
                        type="text"
                        ariaLabel="تعديل الدفعة"
                        className="text-blue-600 hover:!bg-blue-100/50 !w-7 !h-7 !p-0 rounded-lg"
                        icon={<EditFilled />}
                        onClick={(e: any) => handleEdit(e, item?._id)}
                      />
                    </Tooltip>
                    <Tooltip title="حذف الدفعة">
                      <ButtonComponent
                        type="text"
                        danger
                        ariaLabel="حذف الدفعة"
                        className="text-red-600 hover:!bg-red-100/50 !w-7 !h-7 !p-0 rounded-lg"
                        icon={<DeleteFilled />}
                        onClick={(e: any) => handleDelete(e, item?._id)}
                      />
                    </Tooltip>
                  </div>
                </div>
              );
            })
          ) : isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 rounded-2xl border border-gray-200/60 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] p-4 flex flex-col justify-between"
              >
                <SkeletonComponent active type="input" style={{ width: "100%", height: 20 }} />
                <SkeletonComponent active type="input" style={{ width: "60%", height: 20 }} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200/80 dark:border-neutral-800">
              <EmptyComponent description="لم يتم العثور على أي دفعات مسجلة لهذه الشقة" />
            </div>
          )}
        </div>

        {/* Selected Invoice Details / Expenses Table */}
        <div className="space-y-4 pt-4 border-t border-gray-200/80 dark:border-neutral-800">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="المبلغ المسدد (الدفعة الحالية)"
              value={`${totalPatch || 0} ج`}
              variant="success"
              icon={<DollarOutlined />}
            />
            <StatCard
              label="إجمالي المصروفات الحالية"
              value={`${totalPayment || 0} ج`}
              variant="primary"
              icon={<FileTextOutlined />}
            />
            <StatCard
              label="المتبقي من الدفعة"
              value={`${totalRemainPatch || 0} ج`}
              variant={totalRemainPatch < 0 ? "danger" : "warning"}
              icon={<CheckCircleOutlined />}
            />
          </div>

          {/* Subheader and print buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                بنود المصروفات للدفعة المحددة #{selectedInvoiceObj?.code || ""}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                قائمة الأصناف والتكاليف المصروفة من هذه الدفعة
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ButtonComponent
                disabled={!selectedInvoiceObj || !paymentsDataFilter?.length}
                icon={<PrinterFilled />}
                text="طباعة الفاتورة الحالية"
                type="primary"
                onClick={openInvoicePrint}
                className="shadow-sm"
              />
              <ButtonComponent
                disabled={!clientData}
                icon={<PrinterFilled />}
                text="طباعة كشف الحساب الشامل"
                type="default"
                onClick={openStatementPrint}
              />
            </div>
          </div>

          {/* Search/Filter for items */}
          <FilterComponent
            clear={resetFilter}
            control={control}
            errors={errors}
            inputsArr={inputsArr}
            onSubmit={handleSubmit(handleFilter)}
          />

          {/* Items Table */}
          <TableComponent
            columns={columns}
            rowKey="code"
            dataSource={apartmentId && clientId ? paymentsDataFilter : []}
            showPagination={false}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default InvoicesPage;
