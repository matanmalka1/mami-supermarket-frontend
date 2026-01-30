import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
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
  const { loginUser } = useAuthActions();

  const {
    register,
    handleSubmit,
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
    toast.loading("Authenticating secure session...", {
      id: "auth",
    });
    
    try {
      // Backend only accepts email/password; strip rememberMe before sending
      const { token, role } = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (!token)
        return toast.error("No token returned from backend", { id: "auth" });

      const validRoles: UserRole[] = ["ADMIN", "MANAGER", "EMPLOYEE", "CUSTOMER"];
      const normalizedRole =
        role && validRoles.includes(role as UserRole) ? (role as UserRole) : null;

      onLogin({ token, role: normalizedRole, remember: data.rememberMe });

      if (normalizedRole === "ADMIN") {
        toast.success("Administrator access granted. Entering Ops Portal...", {
          id: "auth",
          icon: <ShieldCheck className="text-teal-600" />,
          duration: 3000,
        });
        window.location.hash = "#/";
        window.location.reload();
      } else {
        toast.success(`Welcome back! Discover fresh deals today.`, {
          id: "auth",
        });
        navigate("/store");
      }
    } catch (err: any) {
      toast.error(err.message || "Credential verification failed", {
        id: "auth",
      });
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
      />
    </div>
  );
};

export default Login;
