import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface RegistrationFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ form, onSubmit, showPass, setShowPass }) => {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-widest block px-1">First Name</label>
          <input {...register('firstName')} className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none font-bold" placeholder="John" />
          {errors.firstName && <p className="text-[10px] text-red-500 font-bold px-1">{String(errors.firstName.message)}</p>}
        </div>
        <div className="space-y-3">
          <label className="text-[10px] text-gray-400 uppercase tracking-widest block px-1">Last Name</label>
          <input {...register('lastName')} className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none font-bold" placeholder="Doe" />
          {errors.lastName && <p className="text-[10px] text-red-500 font-bold px-1">{String(errors.lastName.message)}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] text-gray-400 uppercase tracking-widest block px-1">Email Address</label>
        <input {...register('email')} className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none font-bold" placeholder="john@example.com" />
        {errors.email && <p className="text-[10px] text-red-500 font-bold px-1">{String(errors.email.message)}</p>}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] text-gray-400 uppercase tracking-widest block px-1">Israeli Phone Number</label>
        <div className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="px-6 py-4 bg-white border-r border-gray-50 flex items-center gap-2 text-sm text-gray-600">+972</div>
          <input {...register('phone')} className="flex-1 py-4 px-6 outline-none bg-white font-bold" placeholder="05X-XXXXXXX" />
        </div>
        {errors.phone && <p className="text-[10px] text-red-500 font-bold px-1">{String(errors.phone.message)}</p>}
      </div>

      <div className="space-y-3">
        <div className="relative group">
          <input {...register('password')} type={showPass ? 'text' : 'password'} className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-emerald-500/5 focus:border-[#008A45] outline-none font-bold" placeholder="Password" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#008A45]">
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className="text-[10px] text-red-500 font-bold px-1">{String(errors.password.message)}</p>}
      </div>

      <div className="flex items-center gap-4 px-1">
        <input type="checkbox" {...register('acceptTerms')} className="w-6 h-6 rounded-lg border-2 border-gray-200 text-[#16A34A] focus:ring-[#16A34A]" id="acceptTerms" />
        <label htmlFor="acceptTerms" className="text-sm font-bold text-gray-400 cursor-pointer">I agree to the <span className="text-[#008A45] hover:underline">Terms</span>.</label>
      </div>

      <Button disabled={isSubmitting} fullWidth className="h-16 rounded-2xl text-xl " icon={<ArrowRight size={24} />}>
        {isSubmitting ? 'Processing...' : 'Continue'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
