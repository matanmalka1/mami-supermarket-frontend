
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
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
          <p className="text-gray-500 font-medium">Enter your email and we'll send you recovery instructions.</p>
        </div>

        {sent ? (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-900">Check your inbox!</p>
              <p className="text-sm text-gray-500">If an account exists for {email}, you'll receive a link shortly.</p>
            </div>
            <Button variant="outline" fullWidth onClick={() => setSent(false)}>Try another email</Button>
          </div>
        ) : (
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
            <Button fullWidth size="lg" loading={loading} type="submit">Send Reset Link</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
