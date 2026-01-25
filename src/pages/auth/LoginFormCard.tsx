import React from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from "react-router";
import { LoginInput } from "@/validation/auth";

type Props = {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  isSubmitting: boolean;
  show: boolean;
  toggleShow: () => void;
  onSubmit: ReturnType<UseFormHandleSubmit<LoginInput>>;
};

const LoginFormCard: React.FC<Props> = ({
  register,
  errors,
  isSubmitting,
  show,
  toggleShow,
  onSubmit,
}) => (
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
    <div className="w-full max-w-md space-y-10">
      <div className="space-y-2">
        <h2 className="text-4xl font-black">Sign In</h2>
        <p className="text-gray-500 font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
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
              onClick={toggleShow}
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
);

export default LoginFormCard;
