import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { FIELD_WRAPPER_CLASS, BaseFieldProps } from "./base";
import Input from "../Input";

type PasswordFieldProps = Omit<BaseFieldProps, "type" | "prefix"> & {
  show: boolean;
  onToggle: () => void;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "Password",
  registration,
  error,
  helperText,
  leftIcon,
  show,
  onToggle,
  containerClassName = "",
  inputClassName = "",
  placeholder = "Password",
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <Input
      {...rest}
      {...(registration ?? {})}
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      leftIcon={leftIcon}
      rightIcon={
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-300 hover:text-[#008A45]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      }
      className={inputClassName}
    />
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default PasswordField;
