import React from "react";
import { User, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { UseFormReturn } from "react-hook-form";

type PersonalInfoFormProps = {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
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
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest">
            First Name
          </label>
          <input
            {...register("firstName")}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-400 uppercase tracking-widest">
            Last Name
          </label>
          <input
            {...register("lastName")}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-widest">
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
          <input
            {...register("email")}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-widest">
          Phone
        </label>
        <input
          {...register("phone")}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 outline-none font-bold"
        />
      </div>
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
