import React from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  LABEL_CLASS,
  ERROR_CLASS,
  INPUT_CLASS,
  FIELD_WRAPPER_CLASS,
  BaseFieldProps,
} from "./base";

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
  className = "",
  inputClassName = "",
  placeholder = "Password",
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <label className={LABEL_CLASS}>{label}</label>
    <div className="relative group">
      {leftIcon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        {...(registration ?? {})}
        {...rest}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${INPUT_CLASS} ${leftIcon ? "pl-12" : ""} pr-12 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""} ${className} ${inputClassName}`.trim()}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#008A45]"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {error && <p className={ERROR_CLASS}>{error}</p>}
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default PasswordField;
