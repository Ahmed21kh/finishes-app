import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <Result
        status="404"
        title="404"
        subTitle="لا يوجد صفحة بهذا الرابط"
        extra={<Button type="primary" onClick={()=>navigate("/")}>الرجوع للرئيسية</Button>}
        className="w-full"
      />
    </div>
  )
}

export default NotFoundPage