import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, icon, className = '' }) => (
  <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${className}`}>
    <div className="flex items-center gap-4">
      {icon && (
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#006666]">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-3xl  text-gray-900 tracking-tight ">{title}</h1>
        {subtitle && <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.15em] mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

export default PageHeader;