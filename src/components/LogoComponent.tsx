import { HomeFilled } from "@ant-design/icons";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const LogoComponent: React.FC = () => {
  const { collapsed, primaryColor, secondaryColor } = useContext(AppContext);

  return (
    <div
      className={`flex items-center gap-3 py-4 px-4 transition-all duration-300 select-none ${
        collapsed ? "justify-center" : "justify-start"
      }`}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md text-white transition-transform duration-300 hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 4px 12px ${primaryColor}40`,
        }}
        aria-hidden="true"
      >
        <HomeFilled className="text-xl" />
      </div>

      {!collapsed && (
        <div className="flex flex-col overflow-hidden animate-fade-in">
          <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white leading-tight">
            شـــــــطب
          </span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 truncate">
            م / حاتم الوكيل
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoComponent;
