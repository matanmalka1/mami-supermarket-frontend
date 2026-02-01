import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router";
import RegistrationBenefits from "@/pages/auth/components/RegistrationBenefits";
import RegistrationForm from "@/features/auth/components/RegistrationForm";
import { registerSchema, RegisterInput } from "@/validation/auth";
import type { UserRole } from "@/domains/users/types";
import { useRegister } from "@/features/auth/hooks/useRegister";
import OtpInputGroup from "@/components/ui/form/OtpInputGroup";
import { toast } from "react-hot-toast";

type RegisterPayload = {
  token: string;
  role?: UserRole | null;
  remember?: boolean;
};

const Register: React.FC<{
  onRegister?: (payload: RegisterPayload) => void;
}> = ({ onRegister = () => {} }) => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const {
    loading,
    step,
    setStep,
    handleSendOtp,
    verifyRegisterOtp,
    registerUser,
    loginUser,
  } = useRegister();

  const [registrationValues, setRegistrationValues] = useState<RegisterInput | null>(null);

  const handleSendOtpWithCache = useCallback(
    async (data: RegisterInput) => {
      setRegistrationValues(data);
      await handleSendOtp(data);
    },
    [handleSendOtp],
  );

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  // handleSendOtp is now from useRegister

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) return;
    const formValues = form.getValues();
    const currentValues = registrationValues ?? formValues;
    try {
      await verifyRegisterOtp({ email: currentValues.email, code: otp });
      const fullName = `${currentValues.firstName} ${currentValues.lastName}`.trim();
      const normalizedPhone = (currentValues.phone ?? "").replace(/\D/g, "");
      await registerUser({
        email: currentValues.email,
        password: currentValues.password,
        full_name: fullName,
        phone: normalizedPhone.length >= 9 ? normalizedPhone : undefined,
      });
      const { token, role } = await loginUser({
        email: currentValues.email,
        password: currentValues.password,
      });
      if (!token) return;
      onRegister({
        token,
        role: role as UserRole | undefined,
        remember: false,
      });
      navigate("/store");
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <header className="px-12 py-8 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link
          to="/store"
          className="flex items-center gap-3 text-[#008A45] text-2xl  tracking-tighter"
        >
          <ShoppingBag size={28} /> Mami Supermarket
        </Link>
        <Link
          to="/login"
          className="bg-[#008A45] text-white px-8 py-2.5 rounded-xl text-sm shadow-lg"
        >
          Log In
        </Link>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 p-8 lg:p-24">
        <div className="space-y-12">
          <div className="space-y-3">
            <h1 className="text-7xl text-gray-900 tracking-tight  leading-tight">
              {step === "INFO" ? "Join Us" : "Verify"}
            </h1>
            <p className="text-gray-400 text-xl font-medium tracking-tight">
              {step === "INFO"
                ? "Enter your details to start shopping."
                : "Enter the code sent to " + form.getValues("email")}
            </p>
          </div>

          {step === "INFO" ? (
            <RegistrationForm
              form={form}
              onSubmit={handleSendOtpWithCache}
              showPass={showPass}
              setShowPass={setShowPass}
            />
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 max-w-lg">
              <OtpInputGroup value={otp} onChange={setOtp} />
              <button
                className="w-full bg-[#16A34A] text-white h-20 rounded-[1.5rem] text-2xl shadow-xl active:scale-95"
                disabled={loading}
              >
                Complete Setup
              </button>
              <button
                type="button"
                onClick={() => setStep("INFO")}
                className="w-full text-sm text-gray-400 uppercase tracking-widest hover:text-gray-900"
              >
                Go Back
              </button>
            </form>
          )}
        </div>
        <RegistrationBenefits />
      </main>
    </div>
  );
};

export default Register;
