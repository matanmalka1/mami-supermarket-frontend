import React from "react";
import { FIELD_WRAPPER_CLASS, BaseFieldProps } from "./base";
import Input from "../Input";

const TextField: React.FC<BaseFieldProps> = ({
  helperText,
  containerClassName = "",
  inputClassName = "",
  ...rest
}) => (
  <div className={`${FIELD_WRAPPER_CLASS} ${containerClassName}`.trim()}>
    <Input
      {...rest}
      className={inputClassName}
    />
    {helperText && (
      <p className="text-[10px] text-gray-400 font-bold px-1">{helperText}</p>
    )}
  </div>
);

export default TextField;
