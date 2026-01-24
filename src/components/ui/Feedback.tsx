import React from 'react';
import { Loader2, PackageSearch } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Syncing...' }) => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <Loader2 className="w-8 h-8 text-[#006666] animate-spin" />
    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

export const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100">
    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm">
      <PackageSearch size={32} />
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
    </div>
  </div>
);