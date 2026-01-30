import React from "react";

type Props = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
};

const SettingsField: React.FC<Props> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 font-black text-lg outline-none focus:border-emerald-500"
    />
  </div>
);

export default SettingsField;
