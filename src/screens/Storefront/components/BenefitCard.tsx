import React from "react";

const BenefitCard: React.FC<{
  icon: any;
  title: string;
  desc: string;
  bg: string;
  color: string;
}> = ({ icon, title, desc, bg, color }) => (
  <div
    className={`p-12 ${bg}/50 rounded-[3rem] border border-gray-100 flex flex-col items-center text-center space-y-6 group hover:scale-[1.02] transition-all`}
  >
    <div
      className={`w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center ${color} group-hover:rotate-12 transition-transform`}
    >
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="font-black text-2xl text-gray-900 italic">{title}</h4>
    <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default BenefitCard;
