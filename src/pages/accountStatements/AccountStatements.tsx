/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCircleOutlined,
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, InputNumber, Segmented, TableColumnsType, Tag, Tooltip } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import TableComponent from "../../components/TableComponent";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteAccountStatementApi,
  getAllAccountStatements,
  toggleAccountStatementStatusApi,
} from "../../apis/AccountStatementsApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FilterComponent from "../../components/FilterComponent";
import useConfirmDialog from "../../hooks/useConfirmDialog";

export const AccountStatements = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchParams, setSearchParams] = useState<any>({ page: 1, limit: 10 });
  const queryClient = useQueryClient();
  const { confirm, contextHolder } = useConfirmDialog();

  const searchFilter = yup.object().shape({
    clientName: yup.string().notRequired(),
    code: yup.string().notRequired(),
    phoneNumber: yup.string().notRequired(),
    address: yup.string().notRequired(),
    date: yup.date().notRequired(),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(searchFilter),
  });

  const inputsArr = [
    {
      name: "code",
      render: (field: any) => (
        <InputNumber
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.code ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث بكود العميل"
          {...field}
        />
      ),
      xs: 24,
      lg: 6,
    },
    {
      name: "clientName",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.clientName ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث باسم العميل"
          {...field}
        />
      ),
      xs: 24,
      lg: 6,
    },
    {
      name: "phoneNumber",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.phoneNumber ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث برقم الهاتف"
          {...field}
        />
      ),
      xs: 24,
      lg: 6,
    },
    {
      name: "address",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.address ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث بالعنوان"
          {...field}
        />
      ),
      xs: 24,
      lg: 6,
    },
  ];

  const fetchClients = ({ queryKey }: any) => {
    const [, currentParams] = queryKey;
    return getAllAccountStatements(currentParams);
  };

  const { data, isLoading } = useQuery(
    ["accountStatements", searchParams],
    fetchClients
  );

  const { mutate: deleteAccountStatement, isLoading: loadingDelete } =
    useMutation(deleteAccountStatementApi, {
      onSuccess: (resData) => {
        toast.success(resData?.message || "تم حذف كشف الحساب بنجاح");
        queryClient.invalidateQueries(["accountStatements", searchParams]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف كشف الحساب");
      },
    });

  const { mutate: toggleStatusMutate } = useMutation(
    toggleAccountStatementStatusApi,
    {
      onSuccess: (resData: any) => {
        toast.success(resData?.message || "تم تغيير حالة كشف الحساب بنجاح");
        queryClient.invalidateQueries(["accountStatements"]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء تغيير حالة كشف الحساب");
      },
    }
  );

  const onToggleClientStatus = (record: any) => {
    const isDeactivating = record?.isActive !== false;
    confirm({
      title: isDeactivating ? "تأكيد تعطيل كشف الحساب" : "تأكيد تفعيل كشف الحساب",
      content: isDeactivating
        ? `هل تريد بالتأكيد تعطيل كشف حساب العميل "${record?.clientName}"؟ لن يظهر هذا العميل في قائمة اختيار العملاء في إدارة المصروفات والمدفوعات إلى حين إعادة تفعيله.`
        : `هل تريد بالتأكيد إعادة تفعيل كشف حساب العميل "${record?.clientName}"؟ سيظهر العميل مجدداً في إدارة المصروفات والمدفوعات.`,
      okText: isDeactivating ? "تعطيل الحساب" : "تفعيل الحساب",
      cancelText: "إلغاء",
      onConfirm: () => {
        toggleStatusMutate(record?._id);
      },
    });
  };

  const onDeleteClient = (id: any) => {
    confirm({
      title: "هل أنت متأكد من حذف كشف حساب هذا العميل؟",
      content: "لا يمكن التراجع عن هذه العملية بعد التأكيد.",
      okText: "حذف نهائي",
      cancelText: "إلغاء",
      loading: loadingDelete,
      onConfirm: () => {
        deleteAccountStatement(id);
      },
    });
  };

  const onShowClientDetails = (id: any) => {
    navigate(`/account-statement/${id}`);
  };

  const handleFilter = (search: any) => {
    const filter: any = {
      ...searchParams,
      ...search,
      page: 1,
    };
    if (statusFilter !== "all") {
      filter.status = statusFilter;
    } else {
      delete filter.status;
    }
    setPageNumber(1);
    setSearchParams(filter);
    queryClient.invalidateQueries(["accountStatements", filter]);
  };

  const handleStatusFilterChange = (val: any) => {
    setStatusFilter(val);
    const updated: any = {
      ...searchParams,
      page: 1,
    };
    if (val !== "all") {
      updated.status = val;
    } else {
      delete updated.status;
    }
    setPageNumber(1);
    setSearchParams(updated);
    queryClient.invalidateQueries(["accountStatements", updated]);
  };

  const changePagination = (page: number) => {
    setPageNumber(page);
    const search = {
      ...searchParams,
      page,
    };
    setSearchParams(search);
  };

  const resetFilter = () => {
    reset();
    setStatusFilter("all");
    const defaultParams = { page: 1, limit: 10 };
    setPageNumber(1);
    setSearchParams(defaultParams);
    queryClient.invalidateQueries(["accountStatements", defaultParams]);
  };

  const columns: TableColumnsType<any> = [
    {
      title: "رقم التسلسل",
      dataIndex: "code",
      key: "code",
      width: 110,
      render: (code: any) => (
        <span className="font-semibold text-gray-700 dark:text-gray-300">
          #{code}
        </span>
      ),
    },
    {
      title: "اسم العميل",
      dataIndex: "clientName",
      key: "clientName",
      render: (_value, record) => (
        <div>
          <button
            type="button"
            onClick={() => navigate(`/account-statement/${record?._id}`)}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-right transition-colors block text-sm"
          >
            {record?.clientName}
          </button>
          <span className="text-[11px] text-gray-400">
            {record?.transactionsCount !== undefined ? record.transactionsCount : 0} معاملة مسجلة
          </span>
        </div>
      ),
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone: string) => (
        <span dir="ltr" className="text-gray-600 dark:text-gray-300 font-mono text-xs">
          {phone || "-"}
        </span>
      ),
    },
    {
      title: "المصروفات",
      key: "totalPayments",
      render: (_: any, record: any) => (
        <span className="font-bold text-rose-600 dark:text-rose-400 text-xs" dir="ltr">
          {Number(record?.totalPayments || 0).toLocaleString()} ج.م
        </span>
      ),
    },
    {
      title: "الدفعات",
      key: "totalPatches",
      render: (_: any, record: any) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs" dir="ltr">
          {Number(record?.totalPatches || 0).toLocaleString()} ج.م
        </span>
      ),
    },
    {
      title: "الصافي",
      key: "balance",
      render: (_: any, record: any) => {
        const bal = (Number(record?.totalPatches) || 0) - (Number(record?.totalPayments) || 0);
        const isCred = bal >= 0;
        return (
          <span
            className={`font-black text-xs px-2 py-0.5 rounded-lg ${
              isCred
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                : "text-rose-700 bg-rose-50 dark:bg-rose-950/40"
            }`}
            dir="ltr"
          >
            {Math.abs(bal).toLocaleString()} ج.م {isCred ? "(له)" : "(عليه)"}
          </span>
        );
      },
    },
    {
      title: "الحالة",
      dataIndex: "isActive",
      key: "isActive",
      width: 95,
      align: "center",
      render: (isActive: boolean | undefined) =>
        isActive === false ? (
          <Tag color="default" className="font-bold px-2 py-0.5 rounded-full border-gray-300 dark:border-neutral-700 text-gray-500">
            معطل
          </Tag>
        ) : (
          <Tag color="success" className="font-bold px-2 py-0.5 rounded-full">
            نشط
          </Tag>
        ),
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("ar-EG") : "-",
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 175,
      align: "center",
      render: (_: any, record: any) => (
        <div className="flex items-center justify-center gap-1.5">
          <Tooltip title="عرض التفاصيل">
            <ButtonComponent
              type="text"
              ariaLabel="عرض كشف الحساب"
              className="text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<EyeOutlined />}
              onClick={() => onShowClientDetails(record?._id)}
            />
          </Tooltip>

          <Tooltip title={record?.isActive === false ? "تفعيل كشف الحساب" : "تعطيل كشف الحساب"}>
            <ButtonComponent
              type="text"
              ariaLabel={record?.isActive === false ? "تفعيل كشف الحساب" : "تعطيل كشف الحساب"}
              className={`!w-8 !h-8 !p-0 rounded-lg ${
                record?.isActive === false
                  ? "text-emerald-600 hover:!bg-emerald-50 dark:hover:!bg-emerald-950/40"
                  : "text-amber-600 hover:!bg-amber-50 dark:hover:!bg-amber-950/40"
              }`}
              icon={record?.isActive === false ? <CheckCircleOutlined /> : <StopOutlined />}
              onClick={() => onToggleClientStatus(record)}
            />
          </Tooltip>

          <Tooltip title="تعديل">
            <ButtonComponent
              type="text"
              ariaLabel="تعديل كشف الحساب"
              className="text-amber-600 hover:!bg-amber-50 dark:hover:!bg-amber-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<EditFilled />}
              onClick={() =>
                navigate(`/account-statement/edit-account/${record?._id}`)
              }
            />
          </Tooltip>

          <Tooltip title="حذف">
            <ButtonComponent
              type="text"
              danger
              ariaLabel="حذف كشف الحساب"
              className="text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<DeleteFilled />}
              onClick={() => onDeleteClient(record?._id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="space-y-5 animate-fade-in">
        <PageHeader
          title="كشوفات الحساب للعملاء"
          subtitle="إدارة ومتابعة كشوفات حساب العملاء والدفعات والمصروفات"
          icon={<UserOutlined />}
          extra={
            <ButtonComponent
              type="primary"
              size="large"
              text="فتح كشف حساب جديد"
              icon={<PlusOutlined />}
              onClick={() => navigate("/account-statement/add-account")}
              className="shadow-sm font-semibold"
            />
          }
        />

        <FilterComponent
          clear={resetFilter}
          control={control}
          errors={errors}
          inputsArr={inputsArr}
          onSubmit={handleSubmit(handleFilter)}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#15151c] p-3.5 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              تصفية حسب حالة الحساب:
            </span>
            <Segmented
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={[
                { label: "جميع الحسابات", value: "all" },
                { label: "الحسابات النشطة فقط", value: "active" },
                { label: "الحسابات المعطلة فقط", value: "inactive" },
              ]}
              className="font-cairo font-semibold"
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            إجمالي الحسابات المعروضة:{" "}
            <b className="text-gray-900 dark:text-white font-bold text-sm">
              {data?.metaData?.[0]?.total || 0}
            </b>
          </div>
        </div>

        <TableComponent
          rowKey="_id"
          pageNumber={pageNumber}
          pageSize={searchParams.limit}
          columns={columns}
          total={data?.metaData?.[0]?.total || 0}
          dataSource={data?.data || []}
          loading={isLoading}
          onPageChange={changePagination}
        />
      </div>
    </>
  );
};

export default AccountStatements;
