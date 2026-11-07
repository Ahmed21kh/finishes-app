import React, { useContext } from "react";
import { ConfigProvider, Flex, Layout, theme } from "antd";
import RouterContainer from "./routes/RouterContainer";
import { AppContext } from "./context/AppContext";
import HeaderComponent from "./components/HeaderComponent";
import SideBarComponent from "./components/SideBarComponent";
import BreadcrumbComponent from "./components/BreadcrumbComponent";
import "react-phone-input-2/lib/style.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "./App.css";
import ButtonComponent from "./components/ButtonComponent";
import AmbientBackground from "./components/AmbientBackground";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

// Create QueryClient outside the component to prevent recreating on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode, primaryColor } = useContext(AppContext);
  const isDark = themeMode === "dark";

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <a href="#main-content" className="skip-to-content font-cairo">
        الانتقال إلى المحتوى الرئيسي
      </a>

      <ToastContainer
        theme={isDark ? "dark" : "light"}
        position="top-left"
        rtl={true}
        autoClose={3500}
        closeOnClick
        pauseOnHover
      />

      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          direction="rtl"
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: primaryColor,
              fontFamily: "Cairo, sans-serif",
              borderRadius: 10,
              colorBgContainer: isDark ? "#1a1a1a" : "#ffffff",
              colorBgElevated: isDark ? "#242424" : "#ffffff",
              colorBorder: isDark ? "#303030" : "#e5e7eb",
              colorText: isDark ? "#f5f5f5" : "#1f2937",
              colorTextSecondary: isDark ? "#a3a3a3" : "#6b7280",
            },
            components: {
              Layout: {
                siderBg: isDark ? "#141414" : "#ffffff",
                headerBg: isDark ? "#141414" : "#ffffff",
                bodyBg: isDark ? "#0f0f0f" : "#f8fafc",
              },
              Menu: {
                itemSelectedBg: primaryColor,
                itemSelectedColor: "#ffffff",
                itemMarginBlock: 8,
                itemBorderRadius: 10,
              },
              Button: {
                colorPrimary: primaryColor,
                borderRadius: 10,
              },
              Card: {
                borderRadiusLG: 16,
              },
              Modal: {
                borderRadiusLG: 16,
              },
              Table: {
                borderRadius: 12,
              },
            },
          }}
        >
          <Layout className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 font-cairo">
            <AmbientBackground />
            <SideBarComponent />

            <Layout className="relative z-10 h-full flex flex-col overflow-hidden bg-transparent">
              <HeaderComponent />

              <Content
                id="main-content"
                className="flex-1 overflow-y-auto p-4 sm:p-6 transition-colors"
                style={{ direction: "rtl" }}
              >
                <div className="max-w-7xl mx-auto w-full space-y-4">
                  <Flex
                    justify="space-between"
                    align="center"
                    className="mb-2"
                  >
                    <BreadcrumbComponent />
                    <ButtonComponent
                      type="default"
                      icon={<LeftOutlined />}
                      text="رجوع"
                      ariaLabel="رجوع للصفحة السابقة"
                      onClick={goBack}
                      className="flex items-center gap-1.5 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 shadow-sm"
                    />
                  </Flex>

                  <main className="w-full pb-8">
                    <RouterContainer />
                  </main>
                </div>
              </Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
