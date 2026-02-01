import React from "react";
import {
  FIELD_WRAPPER_CLASS,
  LABEL_CLASS,
  ERROR_CLASS,
  BaseFieldProps,
} from "./base";

type CheckboxFieldProps = Omit<
  BaseFieldProps,
  "type" | "prefix" | "helperText"
> & {
  label: React.ReactNode;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  description,
  registration,
  error,
  containerClassName = "",
  checked,
  onCheckedChange,
  ...rest
}) => {
  const id = rest.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
      <label
        htmlFor={id}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <input
          type="checkbox"
          id={id}
          {...(registration ?? {})}
          {...rest}
          checked={checked}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked);
            registration?.onChange?.(e as any);
            rest.onChange?.(e as any);
          }}
          className="h-5 w-5 rounded border-2 border-gray-300 text-[#008A45] focus:ring-[#008A45]"
        />
        <div>
          <p className={`${LABEL_CLASS} leading-tight text-gray-600`}>
            {label}
          </p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </label>
      {error && <p className={ERROR_CLASS}>{error}</p>}
    </div>
  );
};

export default CheckboxField;
