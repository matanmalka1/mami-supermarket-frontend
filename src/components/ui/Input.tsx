import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const describedBy =
      error && props.id ? `${props.id}-error` : undefined;

    return (
      <div className={`space-y-2 w-full ${containerClassName}`}>
        {label && (
          <label className="text-[10px] uppercase text-gray-400 tracking-widest block px-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006666] transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-gray-50 border border-gray-500 rounded-2xl py-4 px-6 
              text-sm font-bold placeholder:text-gray-700

               outline-none 
              transition-all focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-[#006666]
              ${leftIcon ? "pl-12" : ""}
              ${rightIcon ? "pr-12" : ""}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/5" : ""}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={describedBy}
            className="text-[10px] text-red-500 font-bold px-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
