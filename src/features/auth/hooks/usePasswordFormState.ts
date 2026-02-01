import { useState, type Dispatch, type SetStateAction } from "react";

export type PasswordFormState = {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setToken: Dispatch<SetStateAction<string>>;
  setNewPassword: Dispatch<SetStateAction<string>>;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
};

export const usePasswordFormState = (initialToken = "", initialEmail = ""): PasswordFormState => {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return {
    email,
    token,
    newPassword,
    confirmPassword,
    setEmail,
    setToken,
    setNewPassword,
    setConfirmPassword,
  };
};
