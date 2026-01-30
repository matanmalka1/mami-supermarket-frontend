import React from "react";

export type BadgeVariant =
  | "emerald"
  | "orange"
  | "blue"
  | "red"
  | "gray"
  | "teal"
  | "indigo"
  | "purple";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  orange: "bg-orange-50 text-orange-600 border-orange-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  red: "bg-red-50 text-red-600 border-red-100",
  gray: "bg-gray-50 text-gray-500 border-gray-200",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gray",
  className = "",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
