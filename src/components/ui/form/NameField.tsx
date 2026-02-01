import React from "react";
import TextField from "./TextField";
import type { BaseFieldProps } from "./base";

type NameFieldProps = Omit<BaseFieldProps, "label"> & { label?: string };

const NameField: React.FC<NameFieldProps> = ({
  label = "Name",
  placeholder = "John",
  ...rest
}) => (
  <TextField
    label={label}
    placeholder={placeholder}
    autoComplete="name"
    {...rest}
  />
);

export default NameField;
