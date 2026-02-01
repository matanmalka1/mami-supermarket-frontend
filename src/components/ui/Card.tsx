import React from "react";

export type CardVariant = "default" | "flat" | "glass" | "borderless" | "brand";
export type CardPadding = "none" | "sm" | "md" | "lg" | "xl";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white border border-gray-100 shadow-sm",
  flat: "bg-gray-50/50 border border-gray-100 shadow-none",
  glass: "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl",
  borderless: "bg-white shadow-lg shadow-gray-200/50",
  brand: "bg-[#008A45] text-white border-none shadow-xl shadow-emerald-900/20",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-10",
  xl: "p-16",
};

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`
        rounded-3xl overflow-hidden transition-all duration-300
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverable ? "hover:shadow-xl hover:-translate-y-1" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
