/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spin, SpinProps } from "antd";
import React from "react";

export interface SpinCompProps extends SpinProps {
  [key: string]: any;
}

export const SpinComponents: React.FC<SpinCompProps> = ({
  tip = "جاري التحميل...",
  className = "",
  ...rest
}) => {
  return (
    <div className="flex justify-center items-center py-6 w-full">
      <Spin tip={tip} className={className} {...rest} />
    </div>
  );
};

export const SpinComponent = SpinComponents;
export default SpinComponents;
