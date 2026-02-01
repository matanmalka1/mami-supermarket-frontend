import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline"
  | "brand";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  loading,
  fullWidth,
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#006666] text-white hover:bg-[#005555] shadow-lg shadow-teal-900/10",
    brand:
      "bg-[#008A45] text-white hover:bg-[#006b35] shadow-lg shadow-emerald-900/10",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/10",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
    outline:
      "bg-white border-2 border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-6 text-xl rounded-2xl",
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? "w-full" : ""} 
        ${className}
      `}
      disabled={loading || props.disabled}
      type={type}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
