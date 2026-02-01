import { UseFormReturn } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../../../components/ui/Button";
import type { RegisterInput } from "@/validation/auth";
import NameField from "@/components/ui/form/NameField";
import EmailField from "@/components/ui/form/EmailField";
import PhoneField from "@/components/ui/form/PhoneField";
import PasswordField from "@/components/ui/form/PasswordField";
import CheckboxField from "@/components/ui/form/CheckboxField";

interface RegistrationFormProps {
  form: UseFormReturn<RegisterInput>;
  onSubmit: (data: RegisterInput) => void;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  form,
  onSubmit,
  showPass,
  setShowPass,
}) => {
  const {
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
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
        registration={register("email")}
        placeholder="john@example.com"
      />

      <PhoneField
        label="Israeli Phone Number"
        prefixText="+972"
        registration={register("phone")}
        placeholder=""
      />

      <PasswordField
        label="Password"
        registration={register("password")}
        placeholder="Password"
        show={showPass}
        onToggle={() => setShowPass(!showPass)}
        helperText="Password must be at least 8 characters, include a letter and a number."
      />

      <PasswordField
        label="Confirm Password"
        registration={register("confirmPassword")}
        placeholder="Confirm Password"
        show={showPass}
        onToggle={() => setShowPass(!showPass)}
      />

      <CheckboxField
        label={
          <span className="text-sm font-bold text-gray-400">
            I agree to the{" "}
            <span className="text-[#008A45] hover:underline">Terms</span>.
          </span>
        }
        registration={register("acceptTerms")}
        containerClassName="px-1 !space-y-0"
      />

      <Button
        disabled={isSubmitting}
        type="button"
        onClick={async () => {
          const isValid = await form.trigger();
          if (!isValid) {
            const firstError = Object.values(errors)[0]?.message;
            if (firstError) {
              toast.error(firstError as string);
            }
            return;
          }
          const values = form.getValues();
          (globalThis as any).mockSendRegisterOtp?.(values.email);
          onSubmit(values);
        }}
        fullWidth
        className="h-16 rounded-2xl text-xl "
        icon={<ArrowRight size={24} />}
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
};

export default RegistrationForm;
