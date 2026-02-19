/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Flex, Input, InputNumber, Modal, Row, Typography } from "antd";
import ButtonComponent from "../../components/ButtonComponent";
import {
  DeleteFilled,
  EditFilled,
  ExclamationCircleFilled,
  PlusOutlined,
  PrinterFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { ColumnProps } from "antd/es/table";
import CardComponent from "../../components/CardComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { deleteinvoiceApi, getAllinvoices } from "../../apis/InvoicesApi";
import EmptyComponent from "../../components/EmptyComponent";
import SkeletonComponent from "../../components/SkeletonComponent";
import { toast } from "react-toastify";
import moment from "moment";
import { AppContext } from "../../context/AppContext";
import { useReactToPrint } from "react-to-print";
import PrintContent from "../../components/PrintContent";
import { getOneAccountStatementApi } from "../../apis/AccountStatementsApi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FilterComponent from "../../components/FilterComponent";
import ModalComponent from "../../components/ModalComponent";

interface Props {
  apartmentId?: string | undefined;
  clientId?: string | undefined;
}
const InvoicesPage = ({ clientId, apartmentId }: Props) => {
  const { Title, Text } = Typography;
  const query = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ 
    contentRef: contentRef
  });
  const { primaryColor } = useContext(AppContext);
  const [paymentsData, setpaymentsData] = useState([]);
  const [paymentsDataFilter, setpaymentsDataFilter] = useState([]);
  const navigate = useNavigate();
  const searchParams = { page: 1, limit: 1000 };
  const [activeInvoice, setactiveInvoice] = useState("");
  const [totalPatch, settotalPatch] = useState(0)
  const [totalRemainPatch, settotalRemainPatch] = useState(0)
  const [totalPayment, settotalPayment] = useState(0)
  const [modal, contextHolder] = Modal.useModal();
  const [openPrintDialog, setopenPrintDialog] = useState(false);
  moment.locale("ar");


  const searchFilter = yup.object().shape({
  name: yup.string().notRequired(),
  code: yup.string().notRequired(),
  price:yup.number().notRequired(),
  });

  const {
    handleSubmit,
    formState: { errors: errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(searchFilter),
  });
  const fetchinvoices = ({ queryKey }: any) => {
    console.log(queryKey);
    const [, [searchParams , clientId , apartmentId]] = queryKey;
    const neSearchParams = {
      ...searchParams,
      client: clientId,
      apartment: apartmentId,
    };
    return getAllinvoices(neSearchParams);
  };

  const fetchClient= ({ queryKey }: any) => {
    console.log(queryKey);
    const [, clientId] = queryKey;
    return getOneAccountStatementApi(clientId);
  };


  const { data, isLoading } = useQuery(
    ["invoices", [searchParams, clientId , apartmentId]],
    fetchinvoices,
    { enabled: !!clientId && !!apartmentId }
  );

  const { data:Client } = useQuery(
    ["client", clientId],
    fetchClient,
    { enabled: !!clientId }
  );

  const { mutate: deleteInvoice , isLoading:loadingDelete } = useMutation(deleteinvoiceApi, {
    onSuccess: (data) => {
      console.log(data);
      toast.success(data?.message);
      query.invalidateQueries(["invoices", [searchParams, clientId , apartmentId] ]);
    },
    onError: (error) => {
      console.error(error);
      toast.error(!error);
    },
  });

  const handleOpenPrintDialog = () => {
    setopenPrintDialog(true);
  }

  const handleOpenPrintAllDialog = () => {
    setopenPrintDialog(true);
  }
  const handleClosePrintDialog = () => {
    setopenPrintDialog(false);
  }

  const handleSelectIvoice = (item: any) => {
    console.log({item});
    const arr:any = []
    arr.push(item)
    setpaymentsData(item?.items);
    setpaymentsDataFilter(item?.items);
    setactiveInvoice(item?._id);
    calculateTotal(item);
  };

  const handlePrint = () => {
    reactToPrintFn();
    setopenPrintDialog(false);
  };

  const columns: ColumnProps[] = [
    {
      title: "رقم التسلسل",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "اسم الصنف",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "سعر الصنف",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => (
        <Text>
          {record?.price} ج
        </Text>
      ),
    },
    {
      title: "تاريخ الصنف",
      dataIndex: "date",
      key: "date",
      render: (_: any, record: any) => (
        <Text>
          {moment(record?.date).locale("ca").format(" DD/MM/YYYY - h:mm:ss A ")}
        </Text>
      ),
    },
    {
      title: " ملاحظات",
      dataIndex: "itemNotes",
      key: "itemNotes",
      render: (_: any, record: any) => (
        <Text>
          {record?.itemNotes || 'لا يوجد ملاحظات'}
        </Text>
      ),
    },
  ];

  const inputsArr = [
    {
      name: "code",
      render: (field:any)=> <InputNumber prefix={<SearchOutlined className=" text-gray-400"/>}  status={errors.code&&'error'}  className=" w-full" size="large" placeholder="بحث بكود الصنف" {...field}/>,
      xs:24,
      lg:7
    },
    {
      name: "name",
      render: (field:any)=> <Input prefix={<SearchOutlined className=" text-gray-400"/>} status={errors.name&&'error'}  className="w-full" size="large" placeholder="بحث باسم الصنف " {...field}/>,
      xs:24,
      lg:7
    },
    {
      name: "price",
      render: (field:any)=> <InputNumber prefix={<SearchOutlined className=" text-gray-400"/>} status={errors.price&&'error'}  className="w-full" size="large" placeholder="بحث  بسعر الصنف" {...field}/>,
      xs:24,
      lg:7
    }
  ]

  const handleEdit = (e: MouseEvent | any, id: any) => {
    e.stopPropagation();
    navigate(
      `/account-statement/${clientId}/apartment/${apartmentId}/edit-invoice/${id}`
    );
  };

  const handleDelete = (e: MouseEvent | any, id: any) => {
    e.stopPropagation();
    modal.confirm({
      title: "هل انت متأكد من حذف هذه الدفعة ؟",
      icon: <ExclamationCircleFilled />,
      content: "",
      className: "",
      direction: "rtl",
      okText: "حذف",
      type: "confirm",
      okType: "danger",
      okButtonProps: { type: "primary", loading: loadingDelete },
      cancelText: "الغاء",
      wrapStyle:{backgroundColor:primaryColor},
      onOk() {
        console.log("OK");
        deleteInvoice(id);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };


  useEffect(() => {
    console.log("useEffect",{data});    
    if (data) {
      resetData();
      console.log({isLoading});
      console.log({data});
    }
    
  }, [data, clientId, apartmentId , isLoading , loadingDelete]);

  const resetData = () => {
    let items = data?.data![0]?.items;
    const arr:any = [];
    const item = data?.data![0];
    arr.push(item)
    setpaymentsData(items);
    setpaymentsDataFilter(items);
    setactiveInvoice(data?.data![0]?._id);
    calculateTotal(data?.data![0]);
  }

  const calculateTotal = (item:any) => {
    settotalPatch(item?.payedPatch);
    settotalPayment(item?.totalPrice)
    settotalRemainPatch(item?.remainingAmount)
  }


  const handelFilter = (search:any) =>{
    ['code','price'].forEach((key) => {
      if (search[key]) {
         search[key] = Number(search[key]);
      }
    })
    const filtered = paymentsData.filter((item:any) =>
      Object.entries(search).every(([key, value]) => value ? key == 'name' ? item[key]?.includes((value as any)?.trim()?.toLowerCase())  :  item[key] === value : item )
    );
    console.log({filtered});
    setpaymentsDataFilter(filtered);
  }

 const resetFilter = () => {
    reset();
    setpaymentsDataFilter(paymentsData);
 }

  return (
    <>
    {contextHolder}
    <ModalComponent centered bodyProps={{className:' h-full overflow-auto my-6 max-h-[80vh]'}} title="تفاصيل الفاتورة" height={'95vh'} width={900} style={{direction:'rtl'}} okText="طباعة" cancelText='الغاء' open={openPrintDialog} onClose={handleClosePrintDialog} onCancel={handleClosePrintDialog} onOk={handlePrint}> 
      <div className=" bg-white border-2 shadow-md rounded-lg p-4 h-full overflow-auto max-h-[100%]">
        <PrintContent showPrintContent={true} ref={contentRef}  client={Client} />
      </div>
    </ModalComponent>
    <Flex vertical gap={20}>
      <Flex justify={"space-between"}>
        <Title level={3}>الدفعات</Title>
        <ButtonComponent
          disabled={!clientId || !apartmentId}
          type="primary"
          text="اضافة دفعة"
          icon={<PlusOutlined />}
          onClick={() =>
            navigate(
              `/account-statement/${clientId}/apartment/${apartmentId}/add-invoice`
            )
          }
        />
      </Flex>
      <Flex gap={10} wrap>
        {(apartmentId && clientId && data?.data?.length && !isLoading) ? (
          data?.data?.map((item: any, i: any) => (
            <CardComponent
              hoverable={true}
              key={i}
              className={`shadow-md min-w-[125px]`}
              style={{
                borderColor: activeInvoice == item?._id ? primaryColor : "",
              }}
              onClick={() => handleSelectIvoice(item)}
              actions={[
                <ButtonComponent
                  icon={<EditFilled className=" text-blue-500" />}
                  onClick={(e) => handleEdit(e, item?._id)}
                />,
                <ButtonComponent
                  danger
                  icon={<DeleteFilled />}
                  onClick={(e) => handleDelete(e, item?._id)}
                />,
              ]}
            >
              <Flex vertical gap={10} justify={"center"} align={"center"}>
                <div>{item?.payedPatch}</div>
                <div>{moment(item?.date).format(" DD-MM-YYYY")}</div>
              </Flex>
            </CardComponent>
          ))
        ) : isLoading ? (
          Array.from([1, 2, 3, 4, 5, 6 , 7, 8]).map((i, _j) => (
            <Flex key={i}>
              <SkeletonComponent size="large" active type="Node" style={{width:125,height:161,borderRadius:8}} />
            </Flex>
          ))
        ) : (
          <Flex justify="center" className=" w-full">
            <EmptyComponent description="لا يوجد بيانات" />
          </Flex>
        )}
      </Flex>

      <Flex vertical gap={8}>
        <Flex justify={'space-between'} align={'center'}>
        <Title level={3}>المصروفات</Title>
        <Flex gap={10}>
         <ButtonComponent disabled={!apartmentId || !clientId || isLoading || !paymentsDataFilter?.length} icon={<PrinterFilled/>} text="طباعة الكل" type="primary" onClick={() => handleOpenPrintAllDialog()}/>
         <ButtonComponent disabled={!apartmentId || !clientId || isLoading || !paymentsDataFilter?.length} icon={<PrinterFilled/>} text="طباعة" type="primary" onClick={() => handleOpenPrintDialog()}/>
        </Flex>
         <PrintContent ref={contentRef} client={Client} />
        </Flex>
        <Flex className=" my-4">
        <FilterComponent clear={()=>resetFilter()} control={control} errors={errors} inputsArr={inputsArr} onSubmit={handleSubmit(handelFilter)}/>
        </Flex>
        
        <TableComponent
          footer={() => (
            <Row className=" !w-full">
              <Col xs={8}>
              <Flex gap={6} align={"center"}>
                <Title className=" !text-gray-400 !mb-0" level={4}>
                  الاجمالي :
                </Title>
                <Text className=" !text-lg">{totalPatch||0} ج</Text>
              </Flex>
              </Col>
              <Col xs={8}>
              <Flex gap={6} align={"center"}>
                <Title className=" !text-gray-400 !mb-0" level={4}>
                  المصروف :
                </Title>
                <Text className=" !text-lg">{totalPayment||0} ج</Text>
              </Flex>
              </Col>
              <Col xs={8}>
              <Flex gap={6} align={"center"}>
                <Title className=" !text-gray-400 !mb-0" level={4}>
                  المتبقي :
                </Title>
                <Text className=" !text-lg">{totalRemainPatch||0} ج</Text>
              </Flex>
              </Col>
            </Row>
          )}
          columns={columns}
          rowKey={'code'}
          dataSource={apartmentId && clientId ? paymentsDataFilter : []}
        />
      </Flex>
    </Flex>
    </>
  );
};

export default InvoicesPage;
