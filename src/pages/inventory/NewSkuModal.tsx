import React from "react";
import Modal from "@/components/ui/Modal";
import NewSkuForm from "@/pages/inventory/NewSkuForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const NewSkuModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Initialize New SKU"
    subtitle="Global Product Registry Enrollment"
  >
    <NewSkuForm isOpen={isOpen} onSuccess={onSuccess} />
  </Modal>
);

export default NewSkuModal;
