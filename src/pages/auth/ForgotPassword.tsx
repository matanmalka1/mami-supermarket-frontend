
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <div className="text-center space-y-4">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <h1 className="text-4xl font-black italic tracking-tight">Recover Account</h1>
          <p className="text-gray-500 font-medium">
            Password recovery via email is not implemented yet. Contact support to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" required value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all" 
                placeholder="name@example.com" 
              />
            </div>
          </div>
          <Button fullWidth size="lg" loading={loading} type="submit" disabled>
            Not implemented
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
