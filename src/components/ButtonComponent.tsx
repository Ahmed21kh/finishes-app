/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps, Tooltip } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import React from "react";

export interface ButtonCompProps extends Omit<ButtonProps, "size"> {
  text?: React.ReactNode;
  size?: SizeType;
  className?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  tooltipTitle?: string;
  ariaLabel?: string;
  gradient?: boolean;
  [key: string]: any;
}

export const ButtonComponent = React.forwardRef<
  HTMLButtonElement,
  ButtonCompProps
>(
  (
    {
      text,
      size,
      className = "",
      icon,
      onClick,
      tooltipTitle,
      ariaLabel,
      type,
      style,
      gradient,
      children,
      ...rest
    },
    ref
  ) => {
    const content = text ?? children;
    const label =
      ariaLabel || (typeof text === "string" ? text : tooltipTitle);

    const isPrimary = type === "primary" || gradient;

    const gradientStyle: React.CSSProperties = isPrimary
      ? {
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          borderColor: "transparent",
          color: "#ffffff",
          ...style,
        }
      : style || {};

    const buttonElement = (
      <Button
        ref={ref}
        type={type}
        size={size}
        style={gradientStyle}
        className={`font-medium transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          isPrimary ? "shadow-md hover:opacity-90" : ""
        } ${className}`}
        icon={icon}
        onClick={onClick}
        aria-label={label}
        {...rest}
      >
        {content}
      </Button>
    );

    if (tooltipTitle) {
      return (
        <Tooltip title={tooltipTitle} placement="top">
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  }
);

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;
