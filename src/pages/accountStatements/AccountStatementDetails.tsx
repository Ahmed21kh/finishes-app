/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Col, Flex, Modal, Row, Typography } from "antd"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { deleteAccountStatementApi, getOneAccountStatementApi } from "../../apis/AccountStatementsApi";
import CardComponent from "../../components/CardComponent";
import TableComponent from "../../components/TableComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { DeleteFilled, EditFilled, ExclamationCircleFilled, PrinterFilled } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import ModalComponent from "../../components/ModalComponent";
import PrintContent from "../../components/PrintContent";
import { toast } from "react-toastify";

const AccountStatementDetails = () => {
  const { Text, Title } = Typography
  const { id } = useParams()
  const navigate = useNavigate()
  const [openPrintDialog, setopenPrintDialog] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ 
    contentRef: contentRef,
    documentTitle: 'كشف حساب العميل',
    pageStyle: 'printContent',
  });
  const [modal, contextHolder] = Modal.useModal();


  const {mutate:deleteAccountStatement , isLoading:loadingDelete} = useMutation(deleteAccountStatementApi,{
    onSuccess: (data:any) => {
      console.log(data);
      toast.success(data?.message)
      navigate('/account-statements')
    },
    onError: (error:any) => {
      console.error(error);
      toast.error(!error)
    }
  })
  const { data: client, isLoading } = useQuery('client', { queryFn: () => getOneAccountStatementApi(id), enabled: !!id });

  const patchesColumns = [
    {
      title: 'رقم التسلسل',
      dataIndex: 'code',
      key: 'code',
      width: 300,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'المبلغ',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => `${amount} ج`
    },
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('ar-EG')
    },
    {
      title: 'ملاحظات',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || 'لا يوجد ملاحظات'
    }
  ];

  const paymentsColumns = [
    {
      title: 'رقم التسلسل',
      dataIndex: 'code',
      key: 'code',
      width: 300,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'الاسم',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'السعر',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => `${price} ج`
    },
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('ar-EG')
    },
    {
      title: 'ملاحظات',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || 'لا يوجد ملاحظات'
    }
  ];

  // const { totalPatch, totalPayment, totalRemainPatch } = useMemo(() => {
  //   const totalPatch = client?.patches?.reduce((sum: number, patch: any) => sum + Number(patch.amount), 0) || 0;
  //   const totalPayment = client?.payments?.reduce((sum: number, payment: any) => sum + Number(payment.price), 0) || 0;
  //   const totalRemainPatch = totalPatch - totalPayment;
  //   return { totalPatch, totalPayment, totalRemainPatch };
  // }, [client?.patches, client?.payments]);

  useEffect(() => {
    console.log(id);
    console.log(client);
    
  }, [client])

  const handleOpenPrintDialog = () => {
    setopenPrintDialog(true);
  }

  const onDeleteClient = (id:any) =>{
    modal.confirm({
      title: 'هل انت متأكد من حذف هذا العميل؟',
      icon: <ExclamationCircleFilled />,
      content: '',
      className:'',
      direction:'rtl',
      okText: 'حذف',
      type:'confirm',
      okType:'danger',
      okButtonProps:{type:'primary' , loading:loadingDelete},
      cancelText: 'الغاء',
      onOk() {
        console.log('OK');
        deleteAccountStatement(id);
        
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const handleClosePrintDialog = () => {
    setopenPrintDialog(false);
  }
   
  const onEditClient = () => {
    navigate(`/account-statement/edit-account/${id}`)
  }

  const handlePrint = () => {
    reactToPrintFn();
    setopenPrintDialog(false);
  };

  return (
    <>
    {contextHolder}
      <ModalComponent centered bodyProps={{className:' h-full overflow-auto my-6 max-h-[80vh]'}} title="تفاصيل الفاتورة" height={'95vh'} width={1000} style={{direction:'rtl'}} okText="طباعة" cancelText='الغاء' open={openPrintDialog} onClose={handleClosePrintDialog} onCancel={handleClosePrintDialog} onOk={handlePrint}> 
      <div className=" bg-white border-2 shadow-md rounded-lg p-4 h-full overflow-auto max-h-[100%]">
        <PrintContent showPrintContent={true} ref={contentRef}  client={client} />
      </div>
      </ModalComponent>
      <Flex vertical gap={30}>
      <Flex justify={"end"} gap={10}>
       <ButtonComponent disabled={!id || isLoading} style={{width:'fit-content'}} icon={<PrinterFilled/>} text="طباعة" type="primary" onClick={() => handleOpenPrintDialog()}/>
       <ButtonComponent disabled={!id || isLoading} style={{width:'fit-content'}} danger icon={<DeleteFilled/>} text="حذف" type="primary" onClick={() => onDeleteClient(id)}/>
       <ButtonComponent disabled={!id || isLoading} style={{width:'fit-content'}} icon={<EditFilled/>} text="تعديل" type="primary" onClick={() => onEditClient()}/>
      </Flex>
        <CardComponent title={'تفاصيل كشف الحساب'} loading={isLoading}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">كود العميل :</Text>
                <Title className=" !m-0" level={5}>{client?.code}</Title>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">اسم العميل :</Text>
                <Title className=" !m-0" level={5}>{client?.clientName}</Title>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">رقم التليفون :</Text>
                <Title className=" !m-0" level={5}>{client?.phoneNumber}</Title>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">العنوان :</Text>
                <Title className=" !m-0" level={5}>{client?.address}</Title>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">التاريخ :</Text>
                <Title className=" !m-0" level={5}>{client?.date ? new Date(client.date).toLocaleDateString('ar-EG') : '-'}</Title>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Flex gap={5} align="center">
                <Text type="secondary">ملاحظات :</Text>
                <Title className=" !m-0" level={5}>{client?.notes || '-'}</Title>
              </Flex>
            </Col>
          </Row>
        </CardComponent>
        
            <TableComponent
              footer={() => (
                <Row className=" !w-full">
                  <Col xs={6}>
                    <Flex gap={8} align={"center"}>
                      <Title className=" !text-gray-400 !mb-0" level={5}>
                        اجمالي الدفعات :
                      </Title>
                      <Text className=" !text-lg">{client?.totalPatches || 0} ج</Text>
                    </Flex>
                  </Col>
                  <Col xs={6}>
                    <Flex gap={8} align={"center"}>
                      <Title className=" !text-gray-400 !mb-0" level={5}>
                        المصروف :
                      </Title>
                      <Text className=" !text-lg">{client?.totalPayments || 0} ج</Text>
                    </Flex>
                  </Col>
                  <Col xs={6}>
                    <Flex gap={8} align={"center"}>
                      <Title className=" !text-gray-400 !mb-0" level={5}>
                        المتبقي له :
                      </Title>
                      <Text className=" !text-lg">{client?.creditor || 0} ج</Text>
                    </Flex>
                  </Col>
                  <Col xs={6}>
                    <Flex gap={8} align={"center"}>
                      <Title className=" !text-red-700 !mb-0 " level={5}>
                        الباقي عليه :
                      </Title>
                      <Text className=" !text-lg ">{client?.debtor || 0} ج</Text>
                    </Flex>
                  </Col>
                </Row>
              )}
              columns={paymentsColumns}
              rowKey={(record) => `${record.date}-${record.name}`}
              dataSource={client?.payments || []}
              showPagination={false}
              title={()=><Title level={4}>المصروفات</Title>}
              loading={isLoading}
            />
       
            <TableComponent
              footer={() => (
                <Row className=" !w-full">
                  <Col xs={6}>
                    <Flex gap={6} align={"center"}>
                      <Title className=" !text-gray-400 !mb-0" level={5}>
                        الاجمالي :
                      </Title>
                      <Text className=" !text-lg">{client?.totalPatches || 0} ج</Text>
                    </Flex>
                  </Col>
                </Row>
              )}
              columns={patchesColumns}
              rowKey={(record) => `${record.date}-${record.amount}`}
              dataSource={client?.patches || []}
              showPagination={false}
              title={()=><Title level={4}>الدفعات</Title>}
              loading={isLoading}
            />


      
      </Flex>
    </>
  )
}

export default AccountStatementDetails