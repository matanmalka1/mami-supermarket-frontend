import React from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

const ForgotPasswordDone: React.FC<{ onNavigate: () => void }> = ({
  onNavigate,
}) => (
  <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
      <CheckCircle2 size={40} />
    </div>
    <div className="space-y-2">
      <p className="font-bold text-gray-900">Password updated</p>
      <p className="text-sm text-gray-500">You can now sign in with your new password.</p>
    </div>
    <Button fullWidth onClick={onNavigate}>
      Go to Login
    </Button>
  </div>
);

export default ForgotPasswordDone;
