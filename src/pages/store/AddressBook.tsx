import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Navigation, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Feedback';
import { useAddresses } from '../hooks/useAddresses';

const AddressBook: React.FC = () => {
  const { addresses, loading, addAddress, deleteAddress, tagCurrentLocation, setDefault } = useAddresses();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    addAddress({
      address_line: String(formData.get('street') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      postal_code: String(formData.get('postalCode') || '').trim(),
      country: String(formData.get('country') || 'Israel').trim(),
      is_default: addresses.length === 0,
    });
    setIsModalOpen(false);
  };

  if (loading) return <div className="py-40"><LoadingSpinner label="Syncing address book..." /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic text-gray-900 tracking-tighter">Addresses</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your shipping nodes</p>
        </div>
        <Button variant="emerald" icon={<Plus size={18} />} className="rounded-2xl h-14 px-8" onClick={() => setIsModalOpen(true)}>Add New</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={tagCurrentLocation} className="col-span-full bg-emerald-50/50 border-2 border-dashed border-emerald-200 p-10 rounded-[2.5rem] flex items-center justify-center gap-4 text-emerald-700 font-black italic hover:bg-emerald-100/50 transition-all group">
          <Navigation size={24} className="group-hover:animate-pulse" />
          <span className="text-xl">Tag My Current Location</span>
        </button>

        {addresses.map(addr => (
          <div key={addr.id} className={`p-8 bg-white border-2 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden transition-all ${addr.is_default ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}>
            {addr.is_default && <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-[2rem] font-black text-[10px] uppercase tracking-widest">Default</div>}
            <div className="flex gap-5 items-start">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border"><MapPin size={28} /></div>
              <div><h4 className="font-black text-2xl italic text-gray-900">{addr.address_line || 'Address'}</h4><p className="text-sm font-bold text-gray-500">{addr.city}, {addr.country || 'Israel'} {addr.postal_code ? `• ${addr.postal_code}` : ''}</p></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-50">
              {!addr.is_default && <Button variant="ghost" size="sm" className="text-xs font-black uppercase" onClick={() => setDefault(addr.id)}>Set Default</Button>}
              <button onClick={() => deleteAddress(addr.id)} className="ml-auto w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Delivery Node">
        <form onSubmit={handleAdd} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <input name="city" required placeholder="City" className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold" />
             <input name="street" required placeholder="Street & House #" className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="postalCode" required placeholder="Postal Code" className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold" />
            <input name="country" defaultValue="Israel" required placeholder="Country" className="w-full bg-gray-50 border rounded-xl p-4 outline-none font-bold" />
          </div>
          <Button fullWidth size="lg" className="rounded-2xl" type="submit">Save Address</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddressBook;
