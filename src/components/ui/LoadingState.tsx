import { Loader2 } from "lucide-react";

type LoadingStateProps = {
  label?: string;
};

const LoadingState: React.FC<LoadingStateProps> = ({ label = "Loading..." }) => (
  <div className="p-12 text-center text-gray-400 font-bold flex items-center justify-center gap-3">
    <Loader2 size={20} className="animate-spin" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
