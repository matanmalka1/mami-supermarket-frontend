import React from "react";
import TextField from "./TextField";
import type { BaseFieldProps } from "./base";

type EmailFieldProps = Omit<BaseFieldProps, "label"> & { label?: string };

const EmailField: React.FC<EmailFieldProps> = ({
  label = "Email Address",
  placeholder = "name@example.com",
  type = "email",
  autoComplete = "email",
  ...rest
}) => (
  <TextField
    label={label}
    placeholder={placeholder}
    type={type}
    autoComplete={autoComplete}
    {...rest}
  />
);

export default EmailField;
