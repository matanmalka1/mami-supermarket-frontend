import type { InputHTMLAttributes, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export const LABEL_CLASS =
  "text-[10px] text-gray-400 uppercase tracking-widest block px-1";
export const ERROR_CLASS = "text-[10px] text-red-500 font-bold px-1";
export const INPUT_CLASS =
  "w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none font-bold";
export const FIELD_WRAPPER_CLASS = "space-y-3";
export const GROUP_CLASS =
  "flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm";
export const PREFIX_CLASS =
  "px-6 py-4 bg-white border-r border-gray-50 flex items-center gap-2 text-sm text-gray-600";
export const PREFIX_INPUT_CLASS = "flex-1 py-4 px-6 outline-none bg-white font-bold";

export type BaseFieldProps = {
  label: ReactNode;
  registration?: UseFormRegisterReturn;
  error?: string;
  helperText?: string;
  prefix?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;
