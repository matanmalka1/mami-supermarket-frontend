import React from "react";

export type IconBoxSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: IconBoxSize;
  children: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<IconBoxSize, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
  xl: "w-16 h-16",
  "2xl": "w-20 h-20",
  "3xl": "w-24 h-24",
};

export const IconBox: React.FC<IconBoxProps> = ({
  size = "md",
  children,
  className = "",
  ...props
}) => (
  <div
    className={`${sizeStyles[size]} flex items-center justify-center ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default IconBox;
