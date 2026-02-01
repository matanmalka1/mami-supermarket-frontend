import React from "react";
import {LABEL_CLASS,ERROR_CLASS,FIELD_WRAPPER_CLASS,} from "./base";
import type { TextareaHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type TextAreaFieldProps = {
  label: React.ReactNode;
  registration?: UseFormRegisterReturn;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
  rows?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  registration,
  error,
  helperText,
  containerClassName = "",
  inputClassName = "",
  rows = 3,
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <label className={LABEL_CLASS}>{label}</label>
    <textarea
      {...(registration ?? {})}
      {...rest}
      rows={rows}
      className={`w-full bg-white border border-gray-100 rounded-2xl p-4 outline-none font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] ${inputClassName}`.trim()}
    />
    {error && <p className={ERROR_CLASS}>{error}</p>}
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default TextAreaField;
