import Button from "@/components/ui/Button";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState: React.FC<ErrorStateProps> = ({ message = "Something went wrong", onRetry }) => (
  <div className="p-12 text-center text-red-500 font-bold space-y-3 border border-red-100 bg-red-50 rounded-3xl">
    <p>{message}</p>
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
