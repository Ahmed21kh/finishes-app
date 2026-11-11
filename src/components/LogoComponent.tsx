import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ShatabLogoIcon from "./ShatabLogo";

export const LogoComponent: React.FC = () => {
  const { collapsed } = useContext(AppContext);

  return (
    <div
      className={`flex items-center gap-3 py-4 px-4 transition-all duration-300 select-none ${
        collapsed ? "justify-center" : "justify-start"
      }`}
    >
      <div className="transition-transform duration-300 hover:scale-105 shadow-md rounded-2xl shrink-0">
        <ShatabLogoIcon size={44} />
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
