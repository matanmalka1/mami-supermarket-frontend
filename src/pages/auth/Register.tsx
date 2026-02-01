import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router";
import RegistrationBenefits from "@/components/auth/RegistrationBenefits";
import RegistrationForm from "@/features/auth/components/RegistrationForm";
import { registerSchema, RegisterInput } from "@/validation/auth";
import type { UserRole } from "@/domains/users/types";
import { useRegister } from "@/features/auth/hooks/useRegister";

type RegisterPayload = {
  token: string;
  role?: UserRole | null;
  remember?: boolean;
};

const Register: React.FC<{
  onRegister: (payload: RegisterPayload) => void;
}> = ({ onRegister }) => {
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
    const data = form.getValues();
    try {
      await verifyRegisterOtp({ email: data.email, code: otp });
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await registerUser({
        email: data.email,
        password: data.password,
        full_name: fullName,
      });
      const { token, role } = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (!token) return;
      onRegister({
        token,
        role: role as UserRole | undefined,
        remember: false,
      });
      navigate("/store");
    } catch {
      // Error handling is already in hooks
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
              onSubmit={handleSendOtp}
              showPass={showPass}
              setShowPass={setShowPass}
            />
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 max-w-lg">
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <input
                    key={i}
                    maxLength={1}
                    className="w-16 h-20 bg-white border-2 border-gray-100 rounded-2xl text-center text-3xl text-[#008A45] outline-none focus:border-[#008A45] shadow-sm"
                    onChange={(e) =>
                      setOtp((prev) => (prev + e.target.value).slice(0, 4))
                    }
                  />
                ))}
              </div>
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
