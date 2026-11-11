/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { ColorPicker, Row, Col, Tooltip } from "antd";
import { AppContext } from "../../context/AppContext";
import PageHeader from "../../components/PageHeader";
import CardComponent from "../../components/CardComponent";
import ButtonComponent from "../../components/ButtonComponent";
import {
  BgColorsOutlined,
  CheckCircleFilled,
  DollarCircleOutlined,
  EyeOutlined,
  MoonFilled,
  ReloadOutlined,
  SettingOutlined,
  SunFilled,
} from "@ant-design/icons";
import { toast } from "react-toastify";

interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  description: string;
}

const colorPalettes: ColorPalette[] = [
  {
    name: "أزرق ملكي + نيلي",
    primary: "#1677ff",
    secondary: "#6366f1",
    description: "المظهر الافتراضي الكلاسيكي المتوازن والمريح للعين",
  },
  {
    name: "زمردي فاخر + فيروزي",
    primary: "#059669",
    secondary: "#06b6d4",
    description: "ألوان الطبيعة الراقية لراحة بصرية أثناء العمل الطويل",
  },
  {
    name: "بنفسجي إبداعي + وردي",
    primary: "#7c3aed",
    secondary: "#ec4899",
    description: "طابع عصري وجريء مستوحى من أحدث برامج التصميم",
  },
  {
    name: "برتقالي ناري + كهرماني",
    primary: "#ea580c",
    secondary: "#f59e0b",
    description: "ألوان دافئة وحيوية تعزز التركيز والنشاط",
  },
  {
    name: "كحلي معماري + سماوي",
    primary: "#1e3a8a",
    secondary: "#0ea5e9",
    description: "طابع هندسي احترافي مخصص لشركات المقاولات والتشطيبات",
  },
];

export const SettingsPage: React.FC = () => {
  const {
    themeMode,
    setThemeMode,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
  } = useContext(AppContext);

  const isDark = themeMode === "dark";

  const applyPalette = (palette: ColorPalette) => {
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    toast.success(`تم تطبيق مظهر (${palette.name}) بنجاح`);
  };

  const resetDefaults = () => {
    setThemeMode("light");
    setPrimaryColor("#1677ff");
    setSecondaryColor("#6366f1");
    toast.info("تمت استعادة الألوان الافتراضية للنظام");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <PageHeader
        title="إعدادات المظهر والألوان"
        subtitle="خصص ألوان النظام والوضع الليلي والتدرجات اللونية لتناسب ذوقك الشخصي"
        icon={<SettingOutlined />}
        extra={
          <ButtonComponent
            type="default"
            icon={<ReloadOutlined />}
            text="استعادة الافتراضي"
            onClick={resetDefaults}
            className="rounded-xl w-full sm:w-auto text-xs sm:text-sm"
          />
        }
      />

      {/* 1. Theme Mode (Dark / Light) */}
      <CardComponent
        title={
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <SunFilled className="text-amber-500" />
            نمط الإضاءة (Theme Mode)
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <div
            onClick={() => setThemeMode("light")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
              !isDark
                ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20"
                : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 bg-white dark:bg-[#1a1a1a]"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">
              <SunFilled />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-gray-900 dark:text-white">
                  الوضع النهاري (Light Mode)
                </span>
                {!isDark && (
                  <CheckCircleFilled className="text-blue-600 text-lg" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                سطوع عالي وإضاءة بيضاء مريحة في الأماكن جيدة الإضاءة
              </p>
            </div>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => setThemeMode("dark")}
            className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex items-center gap-4 ${
              isDark
                ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20"
                : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 bg-white dark:bg-[#1a1a1a]"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center text-2xl shrink-0">
              <MoonFilled />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-gray-900 dark:text-white">
                  الوضع الليلي (Dark Mode)
                </span>
                {isDark && (
                  <CheckCircleFilled className="text-blue-600 text-lg" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                تباين داكن هادئ يخفف إجهاد العين ويوفر استهلاك الطاقة
              </p>
            </div>
          </div>
        </div>
      </CardComponent>

      {/* 2. Custom Colors (Primary & Secondary) */}
      <CardComponent
        title={
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BgColorsOutlined className="text-blue-500" />
            تخصيص الألوان الأساسية والثانوية للتدرج (Gradient)
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Color Picker */}
          <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-gray-900 dark:text-white block">
                  اللون الأساسي (Primary Color)
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  لون الأزرار والعناصر الرئيسية
                </span>
              </div>
              <ColorPicker
                size="large"
                value={primaryColor}
                onChange={(_, hex) => setPrimaryColor(hex)}
                showText
              />
            </div>
            <div
              className="h-9 rounded-xl flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              {primaryColor}
            </div>
          </div>

          {/* Secondary Color Picker */}
          <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-gray-900 dark:text-white block">
                  اللون الثانوي (Secondary Color)
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  طرف التدرج اللوني (Gradient End)
                </span>
              </div>
              <ColorPicker
                size="large"
                value={secondaryColor}
                onChange={(_, hex) => setSecondaryColor(hex)}
                showText
              />
            </div>
            <div
              className="h-9 rounded-xl flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs"
              style={{ backgroundColor: secondaryColor }}
            >
              {secondaryColor}
            </div>
          </div>
        </div>
      </CardComponent>

      {/* 3. Preset Palettes */}
      <CardComponent
        title={
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <BgColorsOutlined className="text-emerald-500" />
            بالتات ألوان مقترحة متناسقة (بنقرة واحدة)
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {colorPalettes.map((palette) => {
            const isSelected =
              primaryColor.toLowerCase() === palette.primary.toLowerCase() &&
              secondaryColor.toLowerCase() === palette.secondary.toLowerCase();

            return (
              <div
                key={palette.name}
                onClick={() => applyPalette(palette)}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20"
                    : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 bg-white dark:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {palette.name}
                  </span>
                  {isSelected && (
                    <CheckCircleFilled className="text-blue-600 text-base" />
                  )}
                </div>

                {/* Gradient Strip */}
                <div
                  className="h-8 rounded-xl shadow-xs mb-2 flex items-center justify-between px-3 text-white text-xs font-mono font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                  }}
                >
                  <span>{palette.primary}</span>
                  <span>{palette.secondary}</span>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                  {palette.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardComponent>

      {/* 4. Live Interactive Preview */}
      <CardComponent
        title={
          <span className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <EyeOutlined className="text-indigo-500" />
            معاينة حية للمظهر والأزرار والتدرجات
          </span>
        }
      >
        <div className="p-6 rounded-2xl border border-gray-200/80 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/40 space-y-6">
          {/* Buttons preview */}
          <div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-3">
              مظهر الأزرار بتأثير التدرج اللوني (Gradient Buttons):
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonComponent
                type="primary"
                size="large"
                text="زر أساسي متدرج"
                className="px-6 font-bold"
              />
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all duration-200 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 4px 14px ${primaryColor}40`,
                }}
              >
                تدرج مخصص ({primaryColor} → {secondaryColor})
              </button>
              <ButtonComponent type="default" size="large" text="زر افتراضي" />
            </div>
          </div>

          {/* Active Sidebar Item Preview */}
          <div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-3">
              معاينة العنصر النشط في القائمة الجانبية:
            </span>
            <div className="max-w-xs">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white font-bold shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 4px 14px ${primaryColor}40`,
                }}
              >
                <DollarCircleOutlined className="text-xl" />
                <span className="text-sm">فتح كشف حساب جديد (عنصر نشط)</span>
                <span className="w-2 h-2 rounded-full bg-white ml-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>
  );
};

export default SettingsPage;
