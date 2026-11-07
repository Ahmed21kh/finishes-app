import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  extra,
  icon,
  className = "",
}) => {
  return (
    <header
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-5 border-b border-gray-100 dark:border-neutral-800 transition-colors ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xl shadow-xs">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="!mb-0 text-gray-900 dark:text-white font-extrabold text-lg sm:text-2xl tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {extra && (
        <div className="flex items-center gap-2 flex-wrap justify-start lg:justify-end shrink-0">
          {extra}
        </div>
      )}
    </header>
  );
};

export default PageHeader;

