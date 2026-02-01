import React from "react";
import {
  LABEL_CLASS,
  ERROR_CLASS,
  INPUT_CLASS,
  FIELD_WRAPPER_CLASS,
  BaseFieldProps,
} from "./base";

const TextField: React.FC<BaseFieldProps> = ({
  label,
  registration,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = "",
  className = "",
  inputClassName = "",
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
        className={`${INPUT_CLASS} ${leftIcon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""} ${className} ${inputClassName}`.trim()}
      />
      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
    {error && <p className={ERROR_CLASS}>{error}</p>}
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default TextField;
