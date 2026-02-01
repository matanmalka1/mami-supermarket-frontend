import React from "react";
import { Mail, Lock } from "lucide-react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { LoginInput } from "@/validation/auth";
import EmailField from "@/components/ui/form/EmailField";
import PasswordField from "@/components/ui/form/PasswordField";
import CheckboxField from "@/components/ui/form/CheckboxField";

type Props = {
  register: UseFormRegister<LoginInput>;
  errors: FieldErrors<LoginInput>;
  isSubmitting: boolean;
  show: boolean;
  toggleShow: () => void;
  onSubmit: ReturnType<UseFormHandleSubmit<LoginInput>>;
  trigger: () => Promise<boolean>;
};

const LoginFormCard: React.FC<Props> = ({
  register,
  errors,
  isSubmitting,
  show,
  toggleShow,
  onSubmit,
  trigger,
}) => (
  <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/50">
    <div className="w-full max-w-md space-y-10">
      <div className="space-y-2">
        <h2 className="text-4xl ">Sign In</h2>
        <p className="text-gray-500 font-medium">
          Welcome back! Please enter your details.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <EmailField
            registration={register("email")}
            leftIcon={<Mail size={18} />}
            placeholder=""
          />
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
          <PasswordField
            label=""
            registration={register("password")}
            placeholder=""
            show={show}
            onToggle={toggleShow}
            leftIcon={<Lock size={18} />}
          />
        </div>
        <CheckboxField
          label="Keep me signed in"
          registration={register("rememberMe")}
          containerClassName="!space-y-0"
        />
        <button
          type="button"
          disabled={isSubmitting}
          onClick={async (e) => {
            e.preventDefault();
            const isValid = await trigger();
            if (!isValid) {
              const firstError = Object.values(errors)[0]?.message;
              if (firstError) {
                toast.error(firstError as string);
              }
              return;
            }
            await onSubmit(e as any);
          }}
          className="w-full bg-[#008A45] text-white py-4 rounded-2xl text-lg hover:shadow-xl transition-all disabled:opacity-50 active:scale-95"
        >
          {isSubmitting ? "Authenticating..." : "Sign In"}
        </button>
      </form>
      <div className="text-center">
        <p className="text-sm font-bold text-gray-400">
          New to Mami Supermarket?{" "}
          <Link to="/register" className="text-[#008A45] hover:underline ml-1">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default LoginFormCard;
