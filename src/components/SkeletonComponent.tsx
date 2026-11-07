/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton, SkeletonProps } from "antd";
import { SkeletonButtonProps } from "antd/es/skeleton/Button";
import { SkeletonImageProps } from "antd/es/skeleton/Image";
import { SkeletonInputProps } from "antd/es/skeleton/Input";
import { SkeletonNodeProps } from "antd/es/skeleton/Node";
import { SkeletonParagraphProps } from "antd/es/skeleton/Paragraph";
import React from "react";

export interface SkeletonCompProps
  extends SkeletonProps,
    SkeletonButtonProps,
    SkeletonImageProps,
    SkeletonInputProps,
    SkeletonParagraphProps,
    SkeletonNodeProps {
  type?: "button" | "image" | "input" | "avatar" | "Node";
  [key: string]: any;
}

export const SkeletonComponent: React.FC<SkeletonCompProps> = ({
  type,
  active = true,
  className = "",
  shape,
  ...rest
}) => {
  if (type === "button") {
    return <Skeleton.Button active={active} className={className} {...rest} />;
  }
  if (type === "avatar") {
    return (
      <Skeleton.Avatar
        shape="circle"
        active={active}
        className={className}
        {...rest}
      />
    );
  }
  if (type === "image") {
    return <Skeleton.Image active={active} className={className} {...rest} />;
  }
  if (type === "input") {
    return <Skeleton.Input active={active} className={className} {...rest} />;
  }
  if (type === "Node") {
    return <Skeleton.Node active={active} className={className} {...rest} />;
  }
  return <Skeleton active={active} className={className} {...rest} />;
};

export default SkeletonComponent;
