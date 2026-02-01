import React from "react";
import type { SelectHTMLAttributes } from "react";
import {
  LABEL_CLASS,
  ERROR_CLASS,
  FIELD_WRAPPER_CLASS,
} from "./base";

type Option = { value: string | number; label: string };

type SelectFieldProps = {
  label: React.ReactNode;
  registration?: any;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholderOption?: string;
  containerClassName?: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  registration,
  error,
  helperText,
  options,
  placeholderOption,
  containerClassName = "",
  className = "",
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <label className={LABEL_CLASS}>{label}</label>
    <select
      {...(registration ?? {})}
      {...rest}
      className={`w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 outline-none font-bold focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] appearance-none ${className}`.trim()}
    >
      {placeholderOption && <option value="">{placeholderOption}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className={ERROR_CLASS}>{error}</p>}
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default SelectField;
