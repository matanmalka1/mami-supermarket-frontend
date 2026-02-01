import React, { useRef } from "react";
import { FIELD_WRAPPER_CLASS, LABEL_CLASS, ERROR_CLASS } from "./base";

type OtpInputGroupProps = {
  label?: string;
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

const OtpInputGroup: React.FC<OtpInputGroupProps> = ({
  label = "Verification Code",
  length = 4,
  value,
  onChange,
  disabled,
  error,
}) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, next: string) => {
    const sanitized = next.replace(/\D/g, "").slice(-1);
    const chars = value.split("");
    chars[index] = sanitized;
    const nextValue = chars.join("").slice(0, length);
    onChange(nextValue);
    if (sanitized && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const padded = (value + " ".repeat(length)).slice(0, length);

  return (
    <div className={FIELD_WRAPPER_CLASS}>
      <label className={LABEL_CLASS}>{label}</label>
      <div className="flex gap-4">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputs.current[idx] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={padded[idx].trim()}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={disabled}
            className="w-16 h-20 bg-white border-2 border-gray-100 rounded-2xl text-center text-3xl text-[#008A45] outline-none focus:border-[#008A45] shadow-sm"
          />
        ))}
      </div>
      {error && <p className={ERROR_CLASS}>{error}</p>}
    </div>
  );
};

export default OtpInputGroup;
