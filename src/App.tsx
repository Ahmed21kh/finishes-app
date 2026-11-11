import React, { useContext, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { themeMode, primaryColor } = useContext(AppContext);
  const isDark = themeMode === "dark";

  // Dynamic Window & Page Title
  useEffect(() => {
    const path = location.pathname;
    let pageName = "";

    if (path.includes("/account-statement/add-account")) {
      pageName = "فتح كشف حساب جديد";
    } else if (path.includes("/account-statement/edit-account")) {
      pageName = "تعديل كشف الحساب";
    } else if (path === "/account-statement" || path === "/account-statement/") {
      pageName = "كشوفات حساب العملاء";
    } else if (path.includes("/payments-and-patches")) {
      pageName = "المصروفات والمدفوعات";
    } else if (path.includes("/settings")) {
      pageName = "إعدادات المظهر والثيم";
    } else if (path.includes("/invoices/add-invoice")) {
      pageName = "إضافة فاتورة";
    } else if (path.includes("/invoices")) {
      pageName = "سجل الفواتير";
    } else if (path.includes("/add-apartment")) {
      pageName = "إضافة شقة";
    } else if (path.includes("/edit-apartment")) {
      pageName = "تعديل شقة";
    } else if (path.includes("/apartment")) {
      pageName = "تفاصيل الشقة";
    } else if (path.startsWith("/account-statement/")) {
      pageName = "تفاصيل كشف الحساب";
    }

    if (pageName) {
      document.title = `شطب - ${pageName}`;
    } else {
      document.title = "شطب";
    }
  }, [location.pathname]);

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
                className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 transition-colors"
                style={{ direction: "rtl" }}
              >
                <div className="max-w-7xl mx-auto w-full space-y-4">
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <div className="overflow-x-auto whitespace-nowrap max-w-[calc(100vw-110px)] sm:max-w-none py-1">
                      <BreadcrumbComponent />
                    </div>
                    <ButtonComponent
                      type="default"
                      icon={<LeftOutlined />}
                      text="رجوع"
                      ariaLabel="رجوع للصفحة السابقة"
                      onClick={goBack}
                      className="flex items-center gap-1 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 shadow-sm shrink-0 px-2.5 sm:px-3 text-xs sm:text-sm"
                    />
                  </div>

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
