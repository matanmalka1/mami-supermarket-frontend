interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  return <div className="text-red-600 font-bold text-center">{error}</div>;
};

export default ErrorDisplay;
