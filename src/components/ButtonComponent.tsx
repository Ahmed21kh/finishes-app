/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Tooltip } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React from "react";

interface ButtonCompProps extends ButtonProps {
  text?: string;
  size?: SizeType;
  className?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: any;
  tooltipTitle?: string;
}
const ButtonComponent = ({
  text,
  size,
  className,
  icon,
  onClick,
  tooltipTitle,
  ...reset
}: ButtonCompProps) => {
  return (
    <Tooltip title={tooltipTitle}>
    <Button
      size={size}
      className={className}
      icon={icon}
      {...reset}
      onClick={onClick}
    >
      {text}
    </Button>
    </Tooltip>
  );
};

export default ButtonComponent;
