import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ShieldCheck, ArrowLeft, KeyRound, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { apiService } from "@/services/api";
import ForgotPasswordDone from "./ForgotPasswordDone";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const qpToken = searchParams.get("token") || "";
    if (qpToken) setToken(qpToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.auth.resetPassword({
        email,
        token,
        new_password: newPassword,
      });
      toast.success("Password updated", { icon: <ShieldCheck size={16} /> });
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <div className="text-center space-y-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
          <h1 className="text-4xl font-black italic tracking-tight">Reset Password</h1>
          <p className="text-gray-500 font-medium">
            Use the token from your email and set a new password. If the link expired, request a new one.
          </p>
        </div>

        {done ? (
          <ForgotPasswordDone onNavigate={() => navigate("/login")} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Reset Token</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-mono text-sm"
                  placeholder="Paste token from email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">New Password</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                placeholder="Enter a strong password"
                minLength={8}
              />
            </div>

            {error && <p className="text-sm font-bold text-red-500 text-center">{error}</p>}

            <Button fullWidth size="lg" loading={loading} type="submit">
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
