/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleFilled,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Flex, Input, InputNumber, Modal, TableColumnsType, Typography } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import TableComponent from "../../components/TableComponent";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteAccountStatementApi,
  getAllAccountStatements,
} from "../../apis/AccountStatementsApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FilterComponent from "../../components/FilterComponent";


const AccountStatements = () => {
  const { Title , Text } = Typography;
  const navigate = useNavigate();
  const [pageNumber, setpageNumber] = useState(1);
  const [searchParams, setsearchParams] = useState({ page: 1, limit: 10 });
  const queryClient = useQueryClient();
  const [modal, contextHolder] = Modal.useModal();

  const searchFilter = yup.object().shape({
    clientName: yup.string().notRequired(),
    code: yup.string().notRequired(),
    phoneNumber: yup.string().notRequired(),
    address: yup.string().notRequired(),
    date: yup.date().notRequired(),
  });
  const {
    handleSubmit,
    formState: { errors: errors },
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
          prefix={<SearchOutlined className=" text-gray-400" />}
          status={errors.code && "error"}
          className=" w-full"
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
          prefix={<SearchOutlined className=" text-gray-400" />}
          status={errors.clientName && "error"}
          className="w-full"
          size="large"
          placeholder="بحث باسم العميل "
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
          prefix={<SearchOutlined className=" text-gray-400" />}
          status={errors.phoneNumber && "error"}
          className="w-full"
          size="large"
          placeholder="بحث برقم الهاتف"
          {...field}
        />
      ),
      xs: 24,
      lg: 5,
    },
    {
      name: "address",
      render: (field: any) => (
        <Input
          prefix={<SearchOutlined className=" text-gray-400" />}
          status={errors.address && "error"}
          className="w-full"
          size="large"
          placeholder="بحث بالعنوان"
          {...field}
        />
      ),
      xs: 24,
      lg: 5,
    },
  ];
  const fetchClients = ({ queryKey }: any) => {
    console.log(queryKey);
    const [, searchParams] = queryKey;
    return getAllAccountStatements(searchParams);
  };

  const { data, isLoading } = useQuery(
    ["accountStatements", searchParams],
    fetchClients
  );

  const { mutate: deleteAccountStatement, isLoading: loadingDelete } =
    useMutation(deleteAccountStatementApi, {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data?.message);
        queryClient.invalidateQueries(["accountStatements", searchParams]);
      },
      onError: (error) => {
        console.error(error);
        toast.error(!error);
      },
    });
  //   useEffect(() => {
  //   console.log(data);
  // }, [data, pageNumber,searchParams])

  const onDeleteClient = (id: any) => {
    modal.confirm({
      title: "هل انت متأكد من حذف هذا العميل؟",
      icon: <ExclamationCircleFilled />,
      content: "",
      className: "",
      direction: "rtl",
      okText: "حذف",
      type: "confirm",
      okType: "danger",
      okButtonProps: { type: "primary", loading: loadingDelete },
      cancelText: "الغاء",
      onOk() {
        console.log("OK");
        deleteAccountStatement(id);
        queryClient.invalidateQueries(["accountStatements", searchParams]);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const onShowClientDetails = (id: any) => {
    navigate(`/account-statement/${id}`);
  };

  const handelFilter = (search: any) => {
    console.log(search);
    let filter = {
      ...searchParams,
      ...search,
    };
    setsearchParams(filter);
    queryClient.invalidateQueries(["clients", filter]);
  };
  const changePagination = (page: any) => {
    console.log(page);
    setpageNumber(page);
    let search = {
      ...searchParams,
      page: page,
    };
    setsearchParams(search);
    queryClient.invalidateQueries(["clients", search]);
  };

  const resetFilter = () => {
    reset();
    setsearchParams({ page: 1, limit: 10 });
  };

  const columns:TableColumnsType<any> = [
    {
      title: "رقم التسلسل",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "اسم العميل",
      dataIndex: "clientName",
      key: "clientName",
      render:(_value,record,_index)=>( <Text className=" cursor-pointer" onClick={()=>navigate(`/account-statement/${record?._id}`)}>{record?.clientName}</Text> )
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "العنوان",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("ar-EG"),
    },
    {
      title: "",
      key: "show",
      render: (_: any, record: any) => (
        <ButtonComponent
          type="primary"
          className=" bg-slate-500 hover:!bg-slate-400"
          tooltipTitle="عرض الحساب"
          icon={<EyeOutlined />}
          onClick={() => onShowClientDetails(record?._id)}
        />
      ),
    },
    {
      title: "",
      key: "edit",
      render: (_: any, record: any) => (
        <ButtonComponent
          type="primary"
          icon={<EditFilled />}
          tooltipTitle="تعديل الحساب"
          onClick={() =>
            navigate(`/account-statement/edit-account/${record?._id}`)
          }
        />
      ),
    },
    {
      title: "",
      key: "delete",
      render: (_: any, record: any) => (
        <ButtonComponent
          type="primary"
          danger
          icon={<DeleteFilled />}
          tooltipTitle="حذف الحساب"
          onClick={() => onDeleteClient(record?._id)}
        />
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <div>
        <Flex justify={"space-between"}>
          <Title level={3}>كشوفات الحساب للعملاء</Title>
          <ButtonComponent
            type="primary"
            text="فتح كشف حساب"
            icon={<PlusOutlined />}
            onClick={() => navigate("/account-statement/add-account")}
          />
        </Flex>
        <Flex justify={"space-between"} className=" my-4">
          <FilterComponent
            clear={() => resetFilter()}
            control={control}
            errors={errors}
            inputsArr={inputsArr}
            onSubmit={handleSubmit(handelFilter)}
          />
        </Flex>
        <div className=" my-3">
          <TableComponent
            rowKey={"code"}
            pageNumber={pageNumber}
            pageSize={searchParams.limit}
            columns={columns}
            total={data?.metaData[0]?.total}
            dataSource={data?.data}
            loading={isLoading}
            onPageChange={changePagination}
          />
        </div>
      </div>
    </>
  );
};

export default AccountStatements;
