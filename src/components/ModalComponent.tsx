/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ModalProps } from "antd";
import React from "react";

export interface ModalCompProps extends ModalProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const ModalComponent: React.FC<ModalCompProps> = ({
  children,
  className = "",
  style,
  ...rest
}) => {
  return (
    <Modal
      className={`rounded-2xl overflow-hidden !max-w-[calc(100vw-20px)] ${className}`}
      style={{ maxWidth: "calc(100vw - 20px)", margin: "12px auto", ...style }}
      destroyOnClose
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
