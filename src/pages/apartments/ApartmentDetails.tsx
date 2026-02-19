import { Col, Flex, Row, Typography } from "antd"
import {useParams } from "react-router-dom";
import { useEffect } from "react";
import {useQuery } from "react-query";
import { getOneapartmentApi} from "../../apis/ApartmentsApi";

import InvoicesPage from "../invoices/InvoicesPage";
import CardComponent from "../../components/CardComponent";
const ApartmentDetails = () => {
  const { Text , Title } = Typography
  const {id, apartmentId} = useParams()
  const {data:apartment , isLoading} = useQuery('apartment',  { queryFn:()=>getOneapartmentApi(apartmentId), enabled:!!apartmentId});
   

  useEffect(() => {  
  console.log(apartmentId);
  console.log(apartment);
  
  }, [ apartmentId , apartment])



  return (
    <>
    <Flex vertical gap={25}>
      <CardComponent title={'تفاصيل الشقة'} loading={isLoading}>
         <Row gutter={[24,24]}>
          <Col xs={24} lg={12}>
          <Flex gap={5} align="center">
            <Text type="secondary">كود الشقة :</Text>
            <Title className=" !m-0" level={5}>{apartment?.code}</Title>
          </Flex>
          </Col>
          <Col xs={24} lg={12}>
          <Flex gap={5} align="center">
            <Text type="secondary">عنوان الشقة :</Text>
            <Title className=" !m-0" level={5}>{apartment?.address}</Title>
          </Flex>
          </Col>
          <Col xs={24} lg={12}>
          <Flex gap={5} align="center">
            <Text type="secondary">اسم العميل :</Text>
            <Title className=" !m-0" level={5}>{apartment?.clientDetails?.name}</Title>
          </Flex>
          </Col>
          <Col xs={24} lg={12}>
          <Flex gap={5} align="center">
            <Text type="secondary">رقم التليفون :</Text>
            <Title className=" !m-0" level={5}>{apartment?.clientDetails?.phoneNumber}</Title>
          </Flex>
          </Col>
         </Row>
      </CardComponent>
      <InvoicesPage clientId={id} apartmentId={apartmentId}/>
    </Flex>
    </>
  )
}

export default ApartmentDetails