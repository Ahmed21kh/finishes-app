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
  ...rest
}) => {
  return (
    <Modal
      className={`rounded-2xl overflow-hidden ${className}`}
      destroyOnClose
      {...rest}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
