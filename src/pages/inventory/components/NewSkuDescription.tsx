import React from "react";

type Props = {
  description: string;
  setDescription: (value: string) => void;
};

const NewSkuDescription: React.FC<Props> = ({ description, setDescription }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
      Description (optional)
    </label>
    <textarea
      value={description}
      onChange={(event) => setDescription(event.target.value)}
      rows={3}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-medium text-sm"
    />
  </div>
);

export default NewSkuDescription;
