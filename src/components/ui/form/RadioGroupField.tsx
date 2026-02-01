import React from "react";
import { LABEL_CLASS, ERROR_CLASS, FIELD_WRAPPER_CLASS } from "./base";

type Option = {
  value: string | number;
  label: string;
  description?: string;
};

type RadioGroupFieldProps = {
  label: string;
  name?: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  registration?: any;
  inline?: boolean;
};

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  registration,
  inline = false,
}) => (
  <div className={FIELD_WRAPPER_CLASS}>
    <label className={LABEL_CLASS}>{label}</label>
    <div className={inline ? "flex flex-wrap gap-3" : "grid gap-3"}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="p-4 rounded-2xl border bg-gray-50 flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors hover:border-emerald-200"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value !== undefined ? value === opt.value : undefined}
            onChange={(e) => {
              onChange?.(e.target.value);
              registration?.onChange?.(e);
            }}
            {...registration}
            className="accent-emerald-600"
          />
          <span>{opt.label}</span>
          {opt.description && (
            <span className="text-xs text-gray-500">{opt.description}</span>
          )}
        </label>
      ))}
    </div>
    {error && <p className={ERROR_CLASS}>{error}</p>}
  </div>
);

export default RadioGroupField;
