import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "primary";
  className?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = "default",
  className = "",
  trend,
}) => {
  const variantStyles = {
    default:
      "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-neutral-800 text-gray-800 dark:text-gray-100",
    primary:
      "bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-100",
    success:
      "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-100",
    danger:
      "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-100",
    warning:
      "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-100",
  };

  const iconStyles = {
    default: "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300",
    primary: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    success: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    danger: "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400",
    warning: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
  };

  const valueStyles = {
    default: "text-gray-900 dark:text-white",
    primary: "text-blue-600 dark:text-blue-400",
    success: "text-emerald-600 dark:text-emerald-400",
    danger: "text-rose-600 dark:text-rose-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${variantStyles[variant]} ${className}`}
      role="region"
      aria-label={label}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-xl sm:text-2xl font-bold tracking-tight ${valueStyles[variant]}`}>
              {value}
            </span>
            {trend && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {trend}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${iconStyles[variant]}`}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

