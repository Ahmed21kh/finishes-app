import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import React from "react";

export interface ConfirmDialogOptions {
  title: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const useConfirmDialog = () => {
  const [modal, contextHolder] = Modal.useModal();

  const confirm = ({
    title,
    content = '',
    okText = 'تأكيد الحذف',
    cancelText = 'إلغاء',
    type = 'danger',
    loading = false,
    onConfirm,
    onCancel,
  }: ConfirmDialogOptions) => {
    modal.confirm({
      title,
      icon: React.createElement(ExclamationCircleFilled, { className: "text-red-500 !ml-2" }),
      content,
      direction: 'rtl',
      okText,
      type: 'confirm',
      okType: type === 'danger' ? 'danger' : 'primary',
      okButtonProps: { type: 'primary', loading },
      cancelText,
      className: "rounded-xl font-cairo",
      onOk: onConfirm,
      onCancel,
    });
  };

  return { confirm, contextHolder };
};

export default useConfirmDialog;

