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
    <Modal 
      opened={isOpen} 
      title={title} 
      onClose={onClose} 
      withCloseButton={!!title}
      classNames={{
        content: "backdrop-blur-xl",
        header: "",
        title: "text-h3 font-bold",
      }}
      styles={{
        content: {
          background: "#FFFFFF",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
        },
        header: {
          borderBottom: "1px solid #E2E8F0",
        },
        title: {
          color: "#6366F1",
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default PrimaryModal;
