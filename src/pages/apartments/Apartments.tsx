/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteFilled,
  EditFilled,
  EyeOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, InputNumber, Tooltip } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import TableComponent from "../../components/TableComponent";
import PageHeader from "../../components/PageHeader";
import FilterComponent from "../../components/FilterComponent";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteapartmentApi,
  getAllapartments,
} from "../../apis/ApartmentsApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

export interface ApartmentsProps {
  clientId: string | undefined;
}

export const Apartments = ({ clientId }: ApartmentsProps) => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    limit: 10,
    client: clientId,
  });
  const queryClient = useQueryClient();
  const { confirm, contextHolder } = useConfirmDialog();

  const searchFilter = yup.object().shape({
    name: yup.string().notRequired(),
    code: yup.string().notRequired(),
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
          placeholder="بحث بكود الشقة"
          {...field}
        />
      ),
      xs: 24,
      lg: 7,
    },
    {
      name: "address",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          status={errors.name ? "error" : undefined}
          className="w-full !rounded-xl"
          size="large"
          placeholder="بحث بعنوان الشقة"
          {...field}
        />
      ),
      xs: 24,
      lg: 7,
    },
  ];

  const fetchApartments = ({ queryKey }: any) => {
    const [, currentParams] = queryKey;
    return getAllapartments(currentParams);
  };

  const { data, isLoading } = useQuery(
    ["apartments", searchParams],
    fetchApartments,
    { enabled: Boolean(clientId) }
  );

  const { mutate: deleteApartment, isLoading: loadingDelete } = useMutation(
    deleteapartmentApi,
    {
      onSuccess: (resData: any) => {
        toast.success(resData?.message || "تم حذف الشقة بنجاح");
        queryClient.invalidateQueries(["apartments", searchParams]);
      },
      onError: () => {
        toast.error("حدث خطأ أثناء حذف الشقة");
      },
    }
  );

  const onDeleteApartment = (id: any) => {
    confirm({
      title: "هل أنت متأكد من حذف هذه الشقة؟",
      content: "سيتم حذف جميع الفواتير والمصروفات المرتبطة بهذه الشقة.",
      okText: "حذف نهائي",
      cancelText: "إلغاء",
      loading: loadingDelete,
      onConfirm: () => {
        deleteApartment(id);
      },
    });
  };

  const onShowApartmentDetails = (id: any) => {
    navigate(`/account-statement/${clientId}/apartment/${id}`);
  };

  const handleFilter = (search: any) => {
    const filter = {
      ...searchParams,
      ...search,
      page: 1,
    };
    setPageNumber(1);
    setSearchParams(filter);
    queryClient.invalidateQueries(["apartments", filter]);
  };

  const changePagination = (page: number) => {
    setPageNumber(page);
    const search = {
      ...searchParams,
      page: page,
    };
    setSearchParams(search);
  };

  const resetFilter = () => {
    reset();
    const defaultParams = { page: 1, limit: 10, client: clientId };
    setPageNumber(1);
    setSearchParams(defaultParams);
    queryClient.invalidateQueries(["apartments", defaultParams]);
  };

  const columns = [
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
      title: "عنوان الشقة",
      dataIndex: "address",
      key: "address",
      render: (address: string, record: any) => (
        <button
          type="button"
          onClick={() => onShowApartmentDetails(record?._id)}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-right"
        >
          {address}
        </button>
      ),
    },
    {
      title: "اسم العميل",
      dataIndex: "clientDetails.name",
      key: "clientDetails.name",
      render: (_: any, record: any) => (
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {record?.clientDetails?.name || "-"}
        </span>
      ),
    },
    {
      title: "رقم التليفون",
      dataIndex: "clientDetails.phoneNumber",
      key: "clientDetails.phoneNumber",
      render: (_: any, record: any) => (
        <span dir="ltr" className="font-mono text-gray-600 dark:text-gray-400">
          {record?.clientDetails?.phoneNumber || "-"}
        </span>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      width: 140,
      align: "center",
      render: (_: any, record: any) => (
        <div className="flex items-center justify-center gap-1.5">
          <Tooltip title="عرض التفاصيل والفواتير">
            <ButtonComponent
              type="text"
              ariaLabel="عرض الشقة"
              className="text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<EyeOutlined />}
              onClick={() => onShowApartmentDetails(record?._id)}
            />
          </Tooltip>

          <Tooltip title="تعديل الشقة">
            <ButtonComponent
              type="text"
              ariaLabel="تعديل الشقة"
              className="text-amber-600 hover:!bg-amber-50 dark:hover:!bg-amber-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<EditFilled />}
              onClick={() =>
                navigate(
                  `/account-statement/${clientId}/edit-apartment/${record?._id}`
                )
              }
            />
          </Tooltip>

          <Tooltip title="حذف الشقة">
            <ButtonComponent
              type="text"
              danger
              ariaLabel="حذف الشقة"
              className="text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/30 !w-8 !h-8 !p-0 rounded-lg"
              icon={<DeleteFilled />}
              onClick={() => onDeleteApartment(record?._id)}
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
          title="الشقق الخاصة بالعميل"
          subtitle="إدارة ومتابعة الشقق والمشاريع التابعة لهذا العميل"
          icon={<HomeOutlined />}
          extra={
            <ButtonComponent
              type="primary"
              size="large"
              text="إضافة شقة جديدة"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate(`/account-statement/${clientId}/add-apartment`)
              }
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

export default Apartments;
