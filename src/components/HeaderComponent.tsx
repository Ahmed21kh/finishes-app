import { Button, Layout, Tooltip } from "antd";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  MoonFilled,
  SettingOutlined,
  SunFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ShatabLogoIcon from "./ShatabLogo";

const { Header } = Layout;

export const HeaderComponent: React.FC = () => {
  const {
    collapsed,
    setCollapsed,
    setThemeMode,
    themeMode,
    isMobile,
    mobileDrawerOpen,
    setMobileDrawerOpen,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Header className="!h-16 !leading-[64px] !px-3 sm:!px-4 !bg-white/95 dark:!bg-[#141417]/95 backdrop-blur-md !border-b border-gray-200/80 dark:border-neutral-800/80 transition-colors z-10 sticky top-0">
      <div className="flex items-center justify-between h-full">
        {/* Toggle Sidebar Button & Mobile Brand */}
        <div className="flex items-center gap-2.5">
          <Tooltip title={isMobile ? "القائمة الرئيسية" : collapsed ? "توسيع القائمة" : "طي القائمة"}>
            <Button
              type="text"
              aria-label={isMobile ? "فتح القائمة" : collapsed ? "توسيع القائمة" : "طي القائمة"}
              icon={
                isMobile ? (
                  <MenuOutlined className="text-lg text-gray-700 dark:text-gray-300" />
                ) : collapsed ? (
                  <MenuUnfoldOutlined className="text-lg text-gray-700 dark:text-gray-300" />
                ) : (
                  <MenuFoldOutlined className="text-lg text-gray-700 dark:text-gray-300" />
                )
              }
              onClick={handleMenuClick}
              className="!w-10 !h-10 rounded-xl hover:!bg-gray-100 dark:hover:!bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
            />
          </Tooltip>

          {/* Mobile Brand indicator (Hidden on desktop) */}
          <div className="flex items-center gap-2 md:hidden">
            <ShatabLogoIcon size={32} className="rounded-xl shadow-xs shrink-0" />
            <span className="font-black text-base text-gray-900 dark:text-white tracking-tight">
              شطب
            </span>
          </div>
        </div>

        {/* Right side controls: Settings & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Settings Page Button */}
          <Tooltip title="إعدادات المظهر والألوان">
            <button
              type="button"
              onClick={() => navigate("/settings")}
              aria-label="الانتقال إلى صفحة إعدادات المظهر"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-900/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <SettingOutlined className="text-base sm:text-lg transition-transform duration-300 hover:rotate-90" />
            </button>
          </Tooltip>

          {/* Theme Toggle Button */}
          <Tooltip
            title={
              themeMode === "light"
                ? "تفعيل الوضع الليلي (Dark Mode)"
                : "تفعيل الوضع النهاري (Light Mode)"
            }
          >
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="تبديل الوضع الليلي والنهاري"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-900/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {themeMode === "light" ? (
                <MoonFilled className="text-sm sm:text-base text-indigo-600 transition-transform duration-200 hover:rotate-12" />
              ) : (
                <SunFilled className="text-sm sm:text-base text-amber-400 transition-transform duration-200 hover:rotate-45" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
