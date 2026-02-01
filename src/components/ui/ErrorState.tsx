import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

type ErrorStateProps = {
  message?: React.ReactNode;
  onRetry?: () => void;
};

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
}) => (
  <div className="p-12 text-center space-y-3 border border-red-100 bg-red-50 rounded-3xl">
    <ErrorMessage message={message} className="text-red-500 font-bold" />
    {onRetry && (
      <div className="flex justify-center">
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )}
  </div>
);

export default ErrorState;
