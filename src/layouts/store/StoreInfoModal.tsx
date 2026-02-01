import Modal from "@/components/ui/Modal";

type InfoModalState = { isOpen: boolean; title: string } | null;

type StoreInfoModalProps = {
  infoModal: InfoModalState;
  onClose: () => void;
};

const StoreInfoModal: React.FC<StoreInfoModalProps> = ({
  infoModal,
  onClose,
}) => (
  <Modal
    isOpen={!!infoModal}
    onClose={onClose}
    title={infoModal?.title || "Information"}
  >
    <div className="py-6 space-y-4">
      {infoModal?.title === "Our Mission" ? (
        <>
          <p className="text-gray-500 text-base leading-relaxed">
            Mami Supermarket's mission is to deliver a premium, high-fidelity
            grocery experience rooted in transparency, sustainability, and human
            care.
          </p>
          <p className="text-base text-gray-500 font-bold">
            We keep Israeli homes stocked by:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex gap-2">
              <span className="text-[#008A45]">•</span>
              Partnering with verified farms to source seasonal, traceable
              goods.
            </li>
            <li className="flex gap-2">
              <span className="text-[#008A45]">•</span>
              Designing ops tooling so every picker, driver, and CSR can act
              fast with confidence.
            </li>
            <li className="flex gap-2">
              <span className="text-[#008A45]">•</span>
              Treating every customer interaction with empathy and measurable
              accountability.
            </li>
          </ul>
        </>
      ) : (
        <p className="text-gray-500 text-sm leading-relaxed">
          Detailed documentation regarding {infoModal?.title?.toLowerCase()} is
          available in our portal.
        </p>
      )}
    </div>
  </Modal>
);

export default StoreInfoModal;
