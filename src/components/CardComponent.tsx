/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardProps } from "antd";
import React from "react";

export interface CardCompProps extends CardProps {
  variant?: "default" | "elevated" | "flat";
  [key: string]: any;
}

export const CardComponent: React.FC<CardCompProps> = ({
  children,
  className = "",
  variant = "default",
  ...rest
}) => {
  const variantClass = {
    default:
      "border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-[#1a1a1a] shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl",
    elevated:
      "border-none bg-white dark:bg-[#1f1f1f] shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl",
    flat: "border border-gray-100 dark:border-neutral-800/80 bg-gray-50/50 dark:bg-neutral-900/50 rounded-2xl",
  }[variant];

  return (
    <Card className={`${variantClass} ${className}`} {...rest}>
      {children}
    </Card>
  );
};

export default CardComponent;
