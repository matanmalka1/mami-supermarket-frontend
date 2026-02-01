import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { sleep } from "@/utils/async";
import { useProfileSettings } from "@/features/auth/hooks/useProfileSettings";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import PersonalInfoForm from "./ProfileSettings/PersonalInfoForm";
import NotificationSettings from "./ProfileSettings/NotificationSettings";
import PasswordChangeForm from "./ProfileSettings/PasswordChangeForm";

type PasswordFormShape = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ProfileSettings: React.FC = () => {
  const { user } = useUserProfile();
  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    }),
    [user],
  );
  const {
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues,
  });
  const form = useForm({ defaultValues });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    weeklyDeals: true,
    freshArrivals: false,
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormShape>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { changePassword, passwordLoading, passwordError, setPasswordError } =
    useProfileSettings();

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference updated", {
      style: { borderRadius: "1rem", fontWeight: "bold" },
    });
  };

  const onSubmit = async () => {
    await sleep(1000);
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return toast.error("Passwords do not match");
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("All password fields are required");
      return toast.error("Please fill every field");
    }

    try {
      await changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      toast.success("Password updated securely");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const message = typeof err === "string" ? err : err?.message;
      const errorMessage = message || "Unable to update password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-5xl  text-gray-900 tracking-tighter">Settings</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
          Update your profile & preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <PersonalInfoForm
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
        <div className="space-y-8">
          <NotificationSettings
            notificationSettings={notificationSettings}
            toggleNotification={toggleNotification}
          />
          <PasswordChangeForm
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            passwordError={passwordError}
            passwordLoading={passwordLoading}
            handlePasswordChange={handlePasswordChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
