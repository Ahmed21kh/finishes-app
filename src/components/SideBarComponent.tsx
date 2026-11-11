/* eslint-disable @typescript-eslint/no-explicit-any */
import Sider from "antd/es/layout/Sider";
import LogoComponent from "./LogoComponent";
import { Drawer, Tooltip } from "antd";
import {
  ReconciliationOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
  SettingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

export interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  section?: string;
}

export const navItems: NavItem[] = [
  {
    key: "/account-statement/add-account",
    icon: <DollarCircleOutlined className="text-xl" />,
    label: "فتح كشف حساب جديد",
    section: "الرئيسية",
  },
  {
    key: "/account-statement",
    icon: <ReconciliationOutlined className="text-xl" />,
    label: "كشوفات حساب العملاء",
    section: "الرئيسية",
  },
  {
    key: "/payments-and-patches",
    icon: <AppstoreOutlined className="text-xl" />,
    label: "المصروفات والمدفوعات",
    section: "الرئيسية",
  },
  {
    key: "/settings",
    icon: <SettingOutlined className="text-xl" />,
    label: "إعدادات المظهر والثيم",
    section: "النظام",
  },
];

export const SideBarComponent: React.FC = () => {
  const {
    collapsed,
    primaryColor,
    secondaryColor,
    themeMode,
    mobileDrawerOpen,
    setMobileDrawerOpen,
  } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState(location.pathname);
  const isDark = themeMode === "dark";

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith("/account-statement/add-account")) {
      setActiveRoute("/account-statement/add-account");
    } else if (pathname.startsWith("/account-statement")) {
      setActiveRoute("/account-statement");
    } else if (pathname.startsWith("/payments-and-patches")) {
      setActiveRoute("/payments-and-patches");
    } else if (pathname.startsWith("/settings")) {
      setActiveRoute("/settings");
    } else {
      setActiveRoute(pathname);
    }
  }, [location.pathname]);

  const handleNavigate = (routeKey: string) => {
    navigate(routeKey);
    setActiveRoute(routeKey);
    if (mobileDrawerOpen) {
      setMobileDrawerOpen(false);
    }
  };

  const sidebarBgStyle = isDark
    ? {
        background: `linear-gradient(180deg, ${primaryColor}24 0%, #11131a 45%, ${secondaryColor}1e 100%)`,
        borderColor: "rgba(255, 255, 255, 0.08)",
      }
    : {
        background: `linear-gradient(180deg, ${primaryColor}18 0%, #ffffff 50%, ${secondaryColor}14 100%)`,
        borderColor: "#e2e8f0",
      };

  const renderNavContent = (isDrawer = false) => {
    const isCollapsed = isDrawer ? false : collapsed;

    return (
      <div className="flex flex-col h-full font-cairo select-none" dir="rtl">
        {/* Brand Header */}
        <div className="border-b border-gray-200/60 dark:border-neutral-800/80 flex items-center justify-between">
          <LogoComponent />
          {isDrawer && (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 ml-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="إغلاق القائمة"
            >
              <CloseOutlined className="text-base" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              إدارة الحسابات
            </p>
          )}

          {navItems.map((item) => {
            const isActive = activeRoute === item.key;
            const isSettings = item.key === "/settings";

            return (
              <React.Fragment key={item.key}>
                {isSettings && !isCollapsed && (
                  <div className="pt-4 pb-1">
                    <div className="h-px bg-gray-200/70 dark:bg-neutral-800/80 my-2" />
                    <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                      النظام
                    </p>
                  </div>
                )}

                <Tooltip
                  title={isCollapsed ? item.label : undefined}
                  placement="left"
                >
                  <button
                    type="button"
                    onClick={() => handleNavigate(item.key)}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    aria-label={item.label}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 text-right group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary ${
                      isCollapsed ? "justify-center px-0" : "justify-start"
                    } ${
                      isActive
                        ? "text-white font-bold shadow-md transform -translate-y-0.5"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/5 font-semibold"
                    }`}
                    style={
                      isActive
                        ? {
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                            boxShadow: `0 4px 14px ${primaryColor}40`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "text-white scale-110"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110"
                      }`}
                    >
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="text-sm truncate flex-1 tracking-tight">
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                </Tooltip>
              </React.Fragment>
            );
          })}
        </div>

        {/* Friendly Bottom Widget (Engineer & Status Card) */}
        <div className="p-3 border-t border-gray-200/60 dark:border-neutral-800/80">
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200/70 dark:border-neutral-800/80 shadow-xs backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  م/ح
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    م / حاتم الوكيل
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">
                      النظام متصل • v1.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tooltip title="م / حاتم الوكيل (النظام متصل 🟢)" placement="left">
              <div className="flex justify-center py-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sider (Visible on >= 768px) */}
      <Sider
        trigger={null}
        width={260}
        collapsedWidth={82}
        collapsible
        collapsed={collapsed}
        style={sidebarBgStyle}
        className="!border-l shadow-sm transition-all duration-300 z-20 hidden md:flex flex-col font-cairo select-none"
        role="navigation"
        aria-label="القائمة الجانبية الرئيسية"
      >
        {renderNavContent(false)}
      </Sider>

      {/* Mobile Drawer (Visible on < 768px when opened) */}
      <Drawer
        placement="right"
        closable={false}
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        width={280}
        styles={{
          body: {
            padding: 0,
            overflow: "hidden",
            ...sidebarBgStyle,
          },
        }}
        className="md:hidden font-cairo"
      >
        {renderNavContent(true)}
      </Drawer>
    </>
  );
};

export default SideBarComponent;
