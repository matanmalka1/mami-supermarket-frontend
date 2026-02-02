import React from "react";
import { User, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { UseFormReturn } from "react-hook-form";
import PhoneField from "@/components/ui/form/PhoneField";
import NameEmailFields from "@/components/ui/form/NameEmailFields";

type PersonalInfoFormProps = {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  onSubmit: (data: any) => Promise<void>;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
}) => {
  const { register, handleSubmit } = form;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white border p-10 rounded-[3rem] shadow-sm"
    >
      <div className="flex items-center gap-3 text-emerald-600 uppercase text-xs tracking-widest border-b pb-6">
        <User size={16} /> Personal Information
      </div>
      <NameEmailFields
        register={register}
        emailLabel="Email"
        emailLeftIcon={<Mail size={18} />}
      />
      <PhoneField
        label="Phone"
        registration={register("phone")}
        prefixText="+972"
      />
      <Button
        fullWidth
        size="lg"
        loading={isSubmitting}
        type="submit"
        className="h-16 rounded-2xl"
      >
        Save Changes
      </Button>
    </form>
  );
};

export default PersonalInfoForm;
