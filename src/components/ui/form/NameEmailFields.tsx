import React from "react";
import { UseFormRegister } from "react-hook-form";
import NameField from "@/components/ui/form/NameField";
import EmailField from "@/components/ui/form/EmailField";

interface NameEmailFieldsProps {
  register: UseFormRegister<any>;
  emailLabel?: string;
  emailLeftIcon?: React.ReactNode;
  emailPlaceholder?: string;
}

const NameEmailFields: React.FC<NameEmailFieldsProps> = ({
  register,
  emailLabel,
  emailLeftIcon,
  emailPlaceholder = "john@example.com",
}) => (
  <>
    <div className="grid grid-cols-2 gap-6">
      <NameField
        label="First Name"
        registration={register("firstName")}
        placeholder="John"
      />
      <NameField
        label="Last Name"
        registration={register("lastName")}
        placeholder="Doe"
      />
    </div>

    <EmailField
      label={emailLabel}
      registration={register("email")}
      placeholder={emailPlaceholder}
      leftIcon={emailLeftIcon}
    />
  </>
);

export default NameEmailFields;
