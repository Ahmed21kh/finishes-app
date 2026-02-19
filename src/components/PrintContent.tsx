/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, ConfigProvider, Divider, Flex, Row, theme, Typography } from "antd";
import React, { useEffect } from "react"
import LogoComponent from "./LogoComponent";
import TableComponent from "./TableComponent";
import Title from "antd/es/typography/Title";
import { FacebookFilled, PhoneFilled, WhatsAppOutlined } from "@ant-design/icons";

interface PrintProps {
    client:any;
    showPrintContent?:boolean;
}   

const PrintContent = React.forwardRef<HTMLDivElement,PrintProps>(({client,showPrintContent},ref) => {
  const { Text} = Typography;
  useEffect(() => {
  console.log(client);

  }, [client])
 const patchesColumns = [
    {
      title: 'رقم التسلسل',
      dataIndex: 'code',
      key: 'code',
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
  return (
    <div ref={ref} className={`h-full w-full p-4 ${showPrintContent?'':'printContent'}`} >
      <ConfigProvider
      direction='rtl'
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
      >
      <div>
      <Flex gap={20} vertical >
        <Flex gap={10} justify={"space-between"} align={"center"}>
          <Flex vertical justify={'start'}>
          <LogoComponent/>
          </Flex>
          <Flex gap={7} vertical align={"start"}>
          <Text><Flex align="center" gap={7}><FacebookFilled className=" text-lg"/>https://facebook.com</Flex></Text>
          <Text><Flex align="center" gap={7}><WhatsAppOutlined className=" text-lg"/> 201020696230</Flex></Text>
          <Text><Flex align="center" gap={7}><PhoneFilled className=" text-lg"/> 201020696230</Flex></Text>
          </Flex>
        </Flex>
      <Flex gap={10} justify={"center"} align={"center"} className=" w-fit mx-auto border border-gray-800 border-solid rounded-lg p-2 px-4 mt-5">
          <Title className=" !mb-0"> كشف حساب العميل </Title>
      </Flex>
        <Divider  style={{borderColor:'darkgrey'}}/>
      <Row gutter={[24,24]} className="" justify={'space-between'} >
        <Col xs={8}>
        <Flex align={'center'} gap={7}>
          <Title level={4} className="!font-bold">  الاسم : </Title>
          <Title level={5} color={'rgb(98 98 98)'} className=" !mt-0">{client?.clientName}</Title>
        </Flex>
        </Col>
        <Col xs={8}>
        <Flex align={'center'} gap={7}>
          <Title level={4} className="!font-bold">  العنوان : </Title>
          <Title level={5} color={'rgb(98 98 98)'} className=" !mt-0">{client?.address}</Title>
        </Flex>
        </Col>
        <Col xs={8}>
        <Flex align={'center'} gap={7}>
          <Title level={4} className="!font-bold">  التاريخ : </Title>
          <Title level={5} color={'rgb(98 98 98)'} className=" !mt-0">{client?.date ? new Date(client.date).toLocaleDateString('ar-EG') : '-'}</Title>
        </Flex>
        </Col>
      </Row>
      <Divider  style={{borderColor:'darkgrey'}}/>
      
      <Flex vertical gap={20}>
      {client?.payments && ( 
        <Flex vertical gap={10}>
        <Title className=" bg-slate-400 w-[150px] text-center p-2 rounded-full !text-white !mb-0" level={4}>المصروفات </Title>
        <TableComponent
          columns={paymentsColumns}
          rowKey={(record) => `${record.date}-${record.name}`}
          dataSource={client.payments}
          showPagination={false}
          bordered
          className=" border border-gray-300"
        />
        </Flex>
            
        )}
        {client?.patches && (
        <Flex vertical gap={10}>
        <Title className=" bg-slate-400 w-[150px] text-center p-2 rounded-full !text-white !mb-0" level={4}> الدفعات</Title>
        <TableComponent
          bordered
          columns={patchesColumns}
          rowKey={(record) => `${record.date}-${record.amount}`}
          dataSource={client.patches}
          showPagination={false}
          className=" border border-gray-300"
        />
        </Flex>
        )}

        <Flex justify="end" className=" w-full">
          <Row className=" w-1/2" gutter={[0,0]}>
            <Col xs={24} className=" border border-gray-300  p-3 ">
              <Flex gap={6} align={"center"} justify="space-between">
                <Title className="  !text-lg !mb-0 text-nowrap" level={5}>
                  اجمالي الدفعات :
                </Title>
                <Text className=" !text-lg !text-nowrap">{client?.totalPatches || 0} ج</Text>
              </Flex>
            </Col>
            <Col xs={24} className=" border border-gray-300  p-3 ">
              <Flex gap={6} align={"center"} justify="space-between">
                <Title className=" !text-lg !mb-0" level={5}>
                  المصروف :
                </Title>
                <Text className=" !text-lg">{client?.totalPayments || 0} ج</Text>
              </Flex>
            </Col>
            <Col xs={24} className=" border border-gray-300  p-3 ">
              <Flex gap={6} align={"center"} justify="space-between">
                <Title className=" !text-lg !mb-0" level={5}>
                  المتبقي له :
                </Title>
                <Text className=" !text-lg">{client?.creditor || 0} ج</Text>
              </Flex>
            </Col>
            <Col xs={24} className=" border border-gray-300  p-3 ">
              <Flex gap={6} align={"center"} justify="space-between">
                <Title className=" !text-lg !text-red-500 !mb-0" level={5}>
                  الباقي عليه :
                </Title>
                <Text className=" !text-lg !text-red-500">{client?.debtor || 0} ج</Text>
              </Flex>
            </Col>
          </Row>
        </Flex>

      </Flex>
      </Flex>
      </div>
      </ConfigProvider>
    </div>
  )
})

export default PrintContent