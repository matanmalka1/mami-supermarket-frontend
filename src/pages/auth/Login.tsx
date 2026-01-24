import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { apiService } from "@/services/api";
import { loginSchema, LoginInput } from "@/validation/auth";

const Login: React.FC<{ onLogin: (role: "ADMIN" | "USER") => void }> = ({
  onLogin,
}) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

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
      const response: any = await apiService.auth.login({
        email: data.email,
        password: data.password,
      });
      console.debug("[Login] login response:", response);
      // Extract token from primary envelope (data.access_token) with fallbacks
      let token: string | null = null;
      let tokenKey: string | null = null;
      if (response?.data?.access_token) { token = response.data.access_token; tokenKey = "data.access_token"; }
      else if (response?.access_token) { token = response.access_token; tokenKey = "access_token"; }
      else if (response?.accessToken) { token = response.accessToken; tokenKey = "accessToken"; }
      else if (response?.data?.token) { token = response.data.token; tokenKey = "data.token"; }
      else if (response?.token) { token = response.token; tokenKey = "token"; }
      const roleFromResponse =
        response?.data?.user?.role ||
        response?.user?.role ||
        response?.data?.role ||
        response?.role;
      if (!token) {
        toast.error("No token returned from backend", { id: "auth" });
        return;
      }
      // Always keep session token; optionally persist to localStorage if rememberMe
      sessionStorage.setItem("mami_token", token);
      if (data.rememberMe) {
        localStorage.setItem("mami_token", token);
      } else {
        localStorage.removeItem("mami_token");
      }
      // Optional: extract role from response or JWT claims
      let role = roleFromResponse;
      if (!role) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1] || ""));
          role = payload.role || payload.user_role || payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
        } catch {
          role = undefined;
        }
      }
      if (role) localStorage.setItem("mami_role", role);
      else localStorage.removeItem("mami_role");
      if ((import.meta as any).env?.DEV) {
        // Dev-only: log which key, token length, and segment count
        console.debug(
          `[Login] token key: ${tokenKey}, length: ${token.length}, segments: ${token.split('.').length}`
        );
      }

      if (role === "ADMIN") {
        toast.success("Administrator access granted. Entering Ops Portal...", {
          id: "auth",
          icon: <ShieldCheck className="text-teal-600" />,
          duration: 3000,
        });
        onLogin(role);
        window.location.hash = "#/";
        window.location.reload();
      } else {
        toast.success(`Welcome back! Discover fresh deals today.`, {
          id: "auth",
        });
        onLogin(role);
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col justify-center px-20 text-white space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#008A45] rounded-xl flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <span className="text-3xl font-black italic">FreshMarket</span>
          </div>
          <h1 className="text-6xl font-black leading-[1.1]">
            Quality produce,
            <br />
            delivered to your doorstep.
          </h1>
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-xs">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-300 mb-2">
              Internal Access Nodes
            </p>
            <p className="text-sm font-medium">
              Admin:{" "}
              <span className="font-black italic text-teal-300">
                admin@mami.com
              </span>
            </p>
            <p className="text-sm font-medium">
              Customer: <span className="font-black italic">user@mami.com</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black">Sign In</h2>
            <p className="text-gray-500 font-medium">
              Welcome back! Please enter your details.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Email Address</label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...register("email")}
                  className={`w-full bg-white border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none transition-all`}
                  placeholder="e.g., name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#008A45] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...register("password")}
                  type={show ? "text" : "password"}
                  className={`w-full bg-white border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#008A45] transition-colors"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-bold">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-5 h-5 rounded border-gray-300 text-[#008A45] focus:ring-[#008A45]"
                id="rememberMe"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-bold text-gray-600 cursor-pointer"
              >
                Keep me signed in
              </label>
            </div>
            <button
              disabled={isSubmitting}
              className="w-full bg-[#008A45] text-white py-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </button>
          </form>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-400">
              New to FreshMarket?{" "}
              <Link
                to="/register"
                className="text-[#008A45] font-black hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
