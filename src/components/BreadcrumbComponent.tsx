/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb } from "antd";
import { ItemType as Item } from "antd/es/breadcrumb/Breadcrumb";
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { HomeFilled } from "@ant-design/icons";

const itemTranslationMap: Record<string, string> = {
  invoices: "فواتيري",
  customers: "العملاء",
  "previous-works": "الأعمال السابقة",
  categories: "الأقسام",
  "add-invoice": "إضافة دفعة",
  "edit-invoice": "تعديل الدفعة",
  "add-category": "إضافة قسم",
  "add-customer": "إضافة عميل",
  "edit-customer": "تعديل عميل",
  "account-statement": "كشف الحساب",
  "add-account": "إضافة كشف الحساب",
  "edit-account": "تعديل كشف الحساب",
  "add-apartment": "إضافة شقة",
  "edit-apartment": "تعديل شقة",
  apartment: "الشقة",
  "payments-and-patches": "المصروفات والمدفوعات",
  settings: "إعدادات المظهر",
};

export const BreadcrumbComponent: React.FC = () => {
  const { location } = useContext(AppContext);

  const routes = useMemo(() => {
    const segments = location.pathname.trim().split("/").filter(Boolean);
    const result = [
      {
        path: "/",
        title: (
          <span className="flex items-center gap-1.5 font-medium text-xs sm:text-sm">
            <HomeFilled className="text-gray-400 dark:text-gray-500" />
            <span>الرئيسية</span>
          </span>
        ),
      },
    ];

    let currentPath = "";
    segments.forEach((segment) => {
      const decoded = decodeURIComponent(segment);
      currentPath += `/${decoded}`;
      const title = itemTranslationMap[segment] || decoded;
      result.push({
        path: currentPath,
        title: <span className="font-medium text-xs sm:text-sm">{title}</span>,
      });
    });

    return result;
  }, [location.pathname]);

  const itemRender = (
    currentRoute: Item,
    _params: any,
    items: Item[],
    _paths: string[]
  ) => {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;
    const isEditAccount = currentRoute?.path?.includes("/edit-account");

    if (isLast || isEditAccount) {
      return (
        <span className="text-gray-800 dark:text-gray-200 font-semibold">
          {currentRoute.title}
        </span>
      );
    }

    return (
      <Link
        to={String(currentRoute.path)}
        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
      >
        {currentRoute.title}
      </Link>
    );
  };

  return (
    <nav aria-label="شريط مسار التنقل" className="py-2.5">
      <Breadcrumb itemRender={itemRender} items={routes} />
    </nav>
  );
};

export default BreadcrumbComponent;
