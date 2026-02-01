import React from "react";
import { Search } from "lucide-react";
import Input, { InputProps } from "./Input";

interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  variant?: "ops" | "store";
}

const SearchInput: React.FC<SearchInputProps> = ({
  variant = "ops",
  className = "",
  ...props
}) => {
  const iconColor =
    variant === "ops"
      ? "group-focus-within:text-[#006666]"
      : "group-focus-within:text-[#008A45]";
  const focusBorder =
    variant === "ops" ? "focus:border-[#006666]" : "focus:border-[#008A45]";

  return (
    <Input
      leftIcon={<Search size={18} className={iconColor} />}
      className={`${focusBorder} ${className}`}
      aria-label={props["aria-label"] || props.placeholder || "Search"}
      {...props}
    />
  );
};

export default SearchInput;
