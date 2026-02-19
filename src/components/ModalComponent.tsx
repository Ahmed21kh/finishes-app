/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, ModalProps } from 'antd'

interface ModalCompProps extends ModalProps {
  children: React.ReactNode;
  reset?: ModalProps;
}
const ModalComponent = ({children,...reset}:ModalCompProps) => {
  return (
    <Modal {...reset}>
        {children}
    </Modal>
  )
}

export default ModalComponent