import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface NotifDropdownProps {
  items: any[];
  onClose: () => void;
}

const NotifDropdown: React.FC<NotifDropdownProps> = ({ items, onClose }) => (
  <div className="absolute top-full right-0 mt-4 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 animate-in slide-in-from-top-2">
    <div className="flex items-center justify-between mb-4 px-2">
       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notifications</h4>
       <button onClick={onClose} className="text-[9px] font-black uppercase text-[#008A45] hover:underline">Clear</button>
    </div>
    <div className="space-y-2">
      {items.map(n => (
        <div key={n.id} className="p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-emerald-100 transition-all flex items-start gap-3">
           <div className="mt-0.5">
             <CheckCircle2 size={14} className={n.type === 'success' ? 'text-emerald-500' : 'text-orange-500'} />
           </div>
           <div className="space-y-0.5">
              <p className="text-xs font-bold text-gray-900">{n.text}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase">{n.time}</p>
           </div>
        </div>
      ))}
    </div>
  </div>
);

export default NotifDropdown;