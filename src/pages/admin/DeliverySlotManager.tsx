import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Clock, ShieldAlert, Save, ChevronRight, Lock, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { MOCK_DELIVERY_SLOTS } from '../../constants';

const DeliverySlotManager: React.FC = () => {
  const [slots, setSlots] = useState(MOCK_DELIVERY_SLOTS);
  const [activeTab, setActiveTab] = useState<'WEEKDAY' | 'WEEKEND'>('WEEKDAY');
  const [isBlackoutModalOpen, setIsBlackoutModalOpen] = useState(false);
  const [blackouts, setBlackouts] = useState([
    { date: '2026-02-14', reason: 'System Maintenance' },
    { date: '2026-05-01', reason: 'Public Holiday' }
  ]);

  const updateCapacity = (id: string, newCap: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, capacity: newCap } : s));
  };

  const handleSave = () => {
    toast.success("Fulfillment configuration pushed to cluster");
  };

  const addBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    setBlackouts([...blackouts, { date: formData.get('date') as string, reason: formData.get('reason') as string }]);
    toast.success("Blackout period appended to global calendar");
  };

  const removeBlackout = (index: number) => {
    setBlackouts(blackouts.filter((_, i) => i !== index));
    toast.error("Blackout removed");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Fulfillment Config</h1>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Branch #4 Logistics Hub • Capacity Management</p>
        </div>
        <Button variant="emerald" icon={<Save size={18} />} className="rounded-2xl h-14 px-10 shadow-xl shadow-emerald-900/10" onClick={handleSave}>
          Publish Changes
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 space-y-8">
           <div className="bg-gray-100 p-1.5 rounded-2xl flex w-fit">
              <button 
                onClick={() => setActiveTab('WEEKDAY')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'WEEKDAY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
              >Weekdays</button>
              <button 
                onClick={() => setActiveTab('WEEKEND')}
                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'WEEKEND' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
              >Weekends</button>
           </div>

           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm divide-y">
              {slots.map(slot => (
                <div key={slot.id} className="p-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border-2 ${slot.status === 'LOCKED' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-[#006666] border-gray-100'}`}>
                      {slot.status === 'LOCKED' ? <Lock size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black italic text-gray-900">{slot.time}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge color={slot.status === 'FULL' ? 'orange' : slot.status === 'LOCKED' ? 'red' : 'emerald'}>{slot.status}</Badge>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{slot.current} Booked</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Slot Capacity</label>
                      <div className="flex bg-gray-100 rounded-xl p-1 border">
                        <button onClick={() => updateCapacity(slot.id, Math.max(0, slot.capacity - 1))} className="w-8 h-8 font-black hover:bg-white rounded-lg transition-colors">-</button>
                        <input value={slot.capacity} readOnly className="bg-transparent w-12 text-center font-black italic text-lg outline-none" />
                        <button onClick={() => updateCapacity(slot.id, slot.capacity + 1)} className="w-8 h-8 font-black hover:bg-white rounded-lg transition-colors">+</button>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-[#006666] p-2">
                       <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <Modal isOpen={isBlackoutModalOpen} onClose={() => setIsBlackoutModalOpen(false)} title="Logistics Blackout" subtitle="Disable fulfillment for specific dates">
         <div className="space-y-8 p-2">
            <form onSubmit={addBlackout} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Date</label>
                <input name="date" type="date" required className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400">Reason</label>
                <div className="flex gap-2">
                  <input name="reason" placeholder="Event Name" required className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none font-bold" />
                  <Button type="submit" className="rounded-xl"><Plus size={18} /></Button>
                </div>
              </div>
            </form>
         </div>
      </Modal>
    </div>
  );
};

export default DeliverySlotManager;