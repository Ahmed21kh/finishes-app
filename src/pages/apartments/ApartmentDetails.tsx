import { Col, Row } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getOneapartmentApi } from "../../apis/ApartmentsApi";
import InvoicesPage from "../invoices/InvoicesPage";
import CardComponent from "../../components/CardComponent";
import PageHeader from "../../components/PageHeader";
import {
  EnvironmentOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const ApartmentDetails = () => {
  const { id, apartmentId } = useParams();
  const { data: apartment, isLoading } = useQuery(
    ["apartment", apartmentId],
    () => getOneapartmentApi(apartmentId),
    { enabled: Boolean(apartmentId) }
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`تفاصيل الشقة: ${apartment?.address || "جاري التحميل..."}`}
        subtitle={`كود الشقة: #${apartment?.code || ""} - العميل: ${
          apartment?.clientDetails?.name || ""
        }`}
        icon={<HomeOutlined />}
      />

      <CardComponent
        loading={isLoading}
        title={
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <HomeOutlined className="text-blue-500" />
            بيانات الشقة والعميل
          </span>
        }
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
              <IdcardOutlined className="text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">كود الشقة</p>
                <p className="font-bold text-gray-900 dark:text-white">#{apartment?.code}</p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
              <EnvironmentOutlined className="text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">عنوان الشقة</p>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {apartment?.address || "-"}
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
              <UserOutlined className="text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">اسم العميل</p>
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {apartment?.clientDetails?.name || "-"}
                </p>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800">
              <PhoneOutlined className="text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">رقم التليفون</p>
                <p className="font-bold text-gray-900 dark:text-white font-mono" dir="ltr">
                  {apartment?.clientDetails?.phoneNumber || "-"}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </CardComponent>

      {/* Embedded Invoices page for this apartment */}
      <InvoicesPage clientId={id} apartmentId={apartmentId} />
    </div>
  );
};

export default ApartmentDetails;
