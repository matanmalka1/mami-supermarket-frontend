import React from "react";
import { ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

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
}) => (
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
      <div className="space-y-2">
        <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-500">
          Current password
        </label>
        <input
          type="password"
          className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
          value={passwordForm.currentPassword}
          onChange={(event) =>
            setPasswordForm((prev) => ({
              ...prev,
              currentPassword: event.target.value,
            }))
          }
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-500">
            Set new password
          </label>
          <input
            type="password"
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
            value={passwordForm.newPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                newPassword: event.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-[0.6rem] uppercase tracking-[0.5em] text-slate-500">
            Confirm password
          </label>
          <input
            type="password"
            className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
            value={passwordForm.confirmPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
          />
        </div>
      </div>
      {passwordError && (
        <p className="text-xs uppercase tracking-[0.3em] text-red-500">
          {passwordError}
        </p>
      )}
      <Button
        fullWidth
        size="lg"
        variant="emerald"
        type="submit"
        loading={passwordLoading}
      >
        Update password
      </Button>
    </form>
  </div>
);

export default PasswordChangeForm;
