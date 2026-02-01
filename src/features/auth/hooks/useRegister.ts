import { useCallback, useState } from "react";
import { useAuthActions } from "./useAuthActions";
import { toast } from "react-hot-toast";
import type { RegisterInput } from "@/validation/auth";

export const useRegister = () => {
  const { sendRegisterOtp, verifyRegisterOtp, registerUser, loginUser } =
    useAuthActions();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"INFO" | "OTP">("INFO");

  const handleSendOtp = useCallback(
    async (data: RegisterInput) => {
      const { email } = data;
      toast.loading("Sending OTP code...", { id: "reg" });
      setLoading(true);
      try {
        await sendRegisterOtp(email);
        (globalThis as any).mockSendRegisterOtp?.(email);
        toast.success("OTP sent to your " + email, { id: "reg" });
        setStep("OTP");
      } catch (err: any) {
        toast.error(err.message || "Failed to send OTP", { id: "reg" });
      } finally {
        setLoading(false);
      }
    },
    [sendRegisterOtp],
  );

  // Add more logic for verify, register, etc. as needed

  return {
    loading,
    step,
    setStep,
    handleSendOtp,
    verifyRegisterOtp,
    registerUser,
    loginUser,
  };
};
