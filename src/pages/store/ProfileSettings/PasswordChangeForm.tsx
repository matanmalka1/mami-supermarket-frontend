import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import PasswordField from "@/components/ui/form/PasswordField";
import ErrorMessage from "@/components/ui/ErrorMessage";

type PasswordFormShape = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordChangeFormProps = {
  passwordForm: PasswordFormShape;
  setPasswordForm: React.Dispatch<React.SetStateAction<PasswordFormShape>>;
  passwordError: string | null;
  passwordLoading: boolean;
  handlePasswordChange: (e: React.FormEvent<HTMLFormElement>) => void;
};

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  passwordForm,
  setPasswordForm,
  passwordError,
  passwordLoading,
  handlePasswordChange,
}) => {
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  return (
    <div className="bg-blue-50 border border-blue-100 p-10 rounded-[3rem] space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-blue-600 uppercase text-xs tracking-widest">
          <ShieldCheck size={16} /> Data Security
        </div>
        <p className="text-sm font-medium text-blue-900/60 leading-relaxed ">
          Your account is secured with end-to-end encryption and biometric-ready
          protocols.
        </p>
      </div>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <PasswordField
          label="Current password"
          registration={undefined}
          value={passwordForm.currentPassword}
          onChange={(event) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: (event.target as HTMLInputElement).value,
            }))
          }
          show={show.current}
          onToggle={() =>
            setShow((prev) => ({ ...prev, current: !prev.current }))
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <PasswordField
            label="Set new password"
            registration={undefined}
            value={passwordForm.newPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: (event.target as HTMLInputElement).value,
              }))
            }
            show={show.next}
            onToggle={() => setShow((prev) => ({ ...prev, next: !prev.next }))}
          />
          <PasswordField
            label="Confirm password"
            registration={undefined}
            value={passwordForm.confirmPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: (event.target as HTMLInputElement).value,
              }))
            }
            show={show.confirm}
            onToggle={() =>
              setShow((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
          />
        </div>
        <ErrorMessage
          message={passwordError}
          className="text-xs uppercase tracking-[0.3em] text-red-500"
        />
        <Button
          fullWidth
          size="lg"
          variant="brand"
          type="submit"
          loading={passwordLoading}
        >
          Update password
        </Button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
