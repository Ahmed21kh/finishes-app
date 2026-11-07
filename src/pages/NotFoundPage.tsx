import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../components/ButtonComponent";
import { HomeOutlined } from "@ant-design/icons";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-[60vh] w-full p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 border border-gray-200/80 dark:border-neutral-800 shadow-sm text-center">
        <Result
          status="404"
          title={<span className="font-extrabold text-5xl text-gray-900 dark:text-white">404</span>}
          subTitle={
            <span className="text-gray-500 dark:text-gray-400 text-base font-medium">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </span>
          }
          extra={
            <ButtonComponent
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              text="العودة إلى الصفحة الرئيسية"
              onClick={() => navigate("/")}
              className="px-6 shadow-sm font-semibold rounded-xl"
            />
          }
          className="p-0"
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
