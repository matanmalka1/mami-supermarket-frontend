import React from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

type AuthHeaderProps = {
  title: string;
  description: React.ReactNode;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, description }) => (
  <div className="text-center space-y-4">
    <Link
      to="/login"
      className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors mb-4"
    >
      <ArrowLeft size={16} /> Back to Login
    </Link>
    <h1 className="text-4xl  tracking-tight">{title}</h1>
    <p className="text-gray-500 font-medium">{description}</p>
  </div>
);

export default AuthHeader;
