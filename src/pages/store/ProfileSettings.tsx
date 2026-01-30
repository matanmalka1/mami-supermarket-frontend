import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Bell, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { sleep } from '@/utils/async';
import { useProfileSettings } from '@/features/auth/hooks/useProfileSettings';
import { useUserProfile } from '@/features/auth/hooks/useUserProfile';

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
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues,
  });

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
    freshArrivals: false
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormShape>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const {
    changePassword,
    passwordLoading,
    passwordError,
    setPasswordError,
  } = useProfileSettings();

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference updated", { style: { borderRadius: '1rem', fontWeight: 'bold' } });
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
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const message = typeof err === 'string' ? err : err?.message;
      const errorMessage = message || "Unable to update password";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-5xl font-black  text-gray-900 tracking-tighter">Settings</h1>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Update your profile & preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white border p-10 rounded-[3rem] shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 font-black uppercase text-xs tracking-widest border-b pb-6">
            <User size={16} /> Personal Information
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">First Name</label>
              <input {...register('firstName')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Last Name</label>
              <input {...register('lastName')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</label>
            <div className="relative"><Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} /><input {...register('email')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold" /></div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone</label>
            <input {...register('phone')} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold" />
          </div>
          <Button fullWidth size="lg" loading={isSubmitting} type="submit" className="h-16 rounded-2xl">Save Changes</Button>
        </form>

        <div className="space-y-8">
          <div className="bg-orange-50 border border-orange-100 p-10 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-orange-600 font-black uppercase text-xs tracking-widest border-b border-orange-200 pb-6">
              <Bell size={16} /> Notifications
            </div>
            <div className="space-y-4 font-bold text-gray-700">
              {[
                { id: 'orderUpdates', label: 'Order updates' },
                { id: 'weeklyDeals', label: 'Weekly deals' },
                { id: 'freshArrivals', label: 'Fresh arrivals' }
              ].map(item => (
                <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                  <span className="group-hover:text-gray-900 transition-colors">{item.label}</span>
                  <div 
                    onClick={() => toggleNotification(item.id as keyof typeof notificationSettings)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationSettings[item.id as keyof typeof notificationSettings] ? 'bg-orange-500' : 'bg-gray-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationSettings[item.id as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        <div className="bg-blue-50 border border-blue-100 p-10 rounded-[3rem] space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-blue-600 font-black uppercase text-xs tracking-widest">
              <ShieldCheck size={16} /> Data Security
            </div>
            <p className="text-sm font-medium text-blue-900/60 leading-relaxed ">
              Your account is secured with end-to-end encryption and biometric-ready protocols.
            </p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[0.6rem] font-black uppercase tracking-[0.5em] text-slate-500">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-[0.5em] text-slate-500">
                 Set new password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.6rem] font-black uppercase tracking-[0.5em] text-slate-500">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                  }
                />
              </div>
            </div>
            {passwordError && (
              <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
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
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
