/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, EmptyProps } from "antd";
import React from "react";

export interface EmptyCompProps extends EmptyProps {
  [key: string]: any;
}

export const EmptyComponent: React.FC<EmptyCompProps> = ({
  description = "لا توجد بيانات متاحة حالياً",
  className = "",
  ...rest
}) => {
  return (
    <div className="py-8 flex justify-center items-center w-full">
      <Empty
        description={
          <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            {description}
          </span>
        }
        className={`my-4 ${className}`}
        {...rest}
      />
    </div>
  );
};

export default EmptyComponent;
