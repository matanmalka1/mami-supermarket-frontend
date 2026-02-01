import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema, LoginInput } from "@/validation/auth";
import type { UserRole } from "@/domains/users/types";
import LoginHero from "./LoginHero";
import LoginFormCard from "./LoginFormCard";

type LoginPayload = {
  token: string;
  role?: UserRole | null;
  remember?: boolean;
};

const Login: React.FC<{ onLogin: (payload: LoginPayload) => void }> = ({
  onLogin,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { handleLogin } = useLogin();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    const normalizedRole = await handleLogin(data, onLogin);
    if (normalizedRole === "ADMIN") {
      toast.success("Administrator access granted. Entering Ops Portal...", {
        id: "auth",
        icon: <ShieldCheck className="text-teal-600" />,
        duration: 3000,
      });
    } else if (normalizedRole) {
      toast.success(`Welcome back! Discover fresh deals today.`, {
        id: "auth",
      });
      navigate("/store");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <LoginHero />
      <LoginFormCard
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        show={show}
        toggleShow={() => setShow(!show)}
        onSubmit={handleSubmit(onSubmit)}
        trigger={trigger}
      />
    </div>
  );
};

export default Login;
