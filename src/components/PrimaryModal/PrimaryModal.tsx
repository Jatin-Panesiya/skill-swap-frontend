import { Modal } from "@mantine/core";
import type { ReactNode } from "react";

interface IPrimaryModalProps {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
}

const PrimaryModal = ({
  children,
  onClose,
  isOpen,
  title,
}: IPrimaryModalProps) => {
  return (
    <Modal opened={isOpen} title={title} onClose={onClose} withCloseButton={!!title}>
      {children}
    </Modal>
  );
};

export default PrimaryModal;
