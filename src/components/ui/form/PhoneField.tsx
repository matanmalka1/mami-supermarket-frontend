import React from "react";
import {
  FIELD_WRAPPER_CLASS,
  LABEL_CLASS,
  ERROR_CLASS,
  GROUP_CLASS,
  PREFIX_CLASS,
  PREFIX_INPUT_CLASS,
  BaseFieldProps,
} from "./base";

type PhoneFieldProps = Omit<BaseFieldProps, "prefix"> & { prefixText?: string };

const PhoneField: React.FC<PhoneFieldProps> = ({
  label = "Phone Number",
  prefixText = "+972",
  placeholder = "05X-XXXXXXX",
  registration,
  error,
  helperText,
  containerClassName = "",
  inputClassName = "",
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <label className={LABEL_CLASS}>{label}</label>
    <div className={`${GROUP_CLASS} ${error ? "border-red-500" : ""}`.trim()}>
      <div className={PREFIX_CLASS}>{prefixText}</div>
      <input
        {...(registration ?? {})}
        {...rest}
        placeholder={placeholder}
        className={`${PREFIX_INPUT_CLASS} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""} ${inputClassName}`.trim()}
      />
    </div>
    {error && <p className={ERROR_CLASS}>{error}</p>}
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default PhoneField;
