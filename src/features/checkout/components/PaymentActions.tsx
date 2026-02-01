import Button from "@/components/ui/Button";
import { currencyILS } from "@/utils/format";

interface PaymentActionsProps {
  loading: boolean;
  onBack: () => void;
  onConfirm: () => void;
  total: number;
  confirmDisabled?: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  loading,
  onBack,
  onConfirm,
  total,
  confirmDisabled = false,
}) => (
  <div className="flex gap-4">
    <Button variant="ghost" className="flex-1 h-16" onClick={onBack}>
      Back
    </Button>
    <Button
      size="lg"
      className="flex-[2] h-16 rounded-2xl"
      loading={loading}
      disabled={confirmDisabled || loading}
      onClick={onConfirm}
    >
      Confirm & Pay {currencyILS(total)}
    </Button>
  </div>
);

export default PaymentActions;
