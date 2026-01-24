import React, { useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Plus, MoreVertical, ShieldCheck, Move, Archive, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useInventory } from '../hooks/useInventory';

const Inventory: React.FC = () => {
  const { inventory, loading, updateStock } = useInventory();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleAction = (action: string, name: string) => {
    toast.success(`${action} initiated for ${name}`);
    setActiveMenuId(null);
  };

  if (loading) return <div className="p-12 text-center text-gray-400 animate-pulse font-bold tracking-widest">Loading global inventory...</div>;

  // Normalize inventory to array. Some API responses may return { items: [...] }, others may return an array directly.
  // The type guard ensures we only access 'items' if it exists and is an array.
  function hasItemsProp(obj: unknown): obj is { items: unknown[] } {
    return !!obj && typeof obj === 'object' && Array.isArray((obj as any).items);
  }
  const rows = Array.isArray(inventory)
    ? inventory
    : hasItemsProp(inventory)
    ? inventory.items
    : [];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Inventory Control</h1>
          <p className="text-sm text-gray-500 mt-1 font-bold uppercase tracking-widest">Global Stock Monitoring • Phase 2 Nodes</p>
        </div>
        <Button 
          variant="primary" 
          className="rounded-2xl h-14 px-8" 
          icon={<Plus size={20} />}
          onClick={() => setIsNewModalOpen(true)}
        >
          New SKU
        </Button>
      </div>

      <Table>
        <THead>
          <TR isHoverable={false}>
            <TH>Product Details</TH>
            <TH>Branch Cluster</TH>
            <TH className="text-center">Stock Level</TH>
            <TH>Reserved</TH>
            <TH className="text-right">Actions</TH>
          </TR>
        </THead>
        <TBody>
          {rows.length === 0 ? (
            <TR>
              <TD colSpan={5} className="text-center text-gray-400 py-12 font-bold italic">No inventory found.</TD>
            </TR>
          ) : rows.map((inv) => (
              <TR key={inv.id}>
              <TD>
                <div className="flex items-center gap-4">
                  <img src={inv.product?.imageUrl || 'https://picsum.photos/seed/product/80/80'} alt={inv.product?.name} className="w-14 h-14 rounded-xl object-cover border shadow-sm" />
                  <div>
                    <h4 className="text-lg leading-tight italic">{inv.product?.name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">SKU: {inv.product?.sku}</p>
                  </div>
                </div>
              </TD>
              <TD>
                <StatusBadge status={inv.branch?.name || 'Central Hub'} />
              </TD>
              <TD>
                <div className="flex items-center justify-center">
                  <input 
                    type="number" 
                    className="w-24 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-black text-center focus:border-[#006666] outline-none"
                    value={inv.availableQuantity}
                    onChange={(e) => updateStock(inv.id, parseInt(e.target.value) || 0)}
                  />
                </div>
              </TD>
              <TD>
                <span className="text-orange-500 font-black italic">{inv.reservedQuantity} Units</span>
              </TD>
              <TD className="text-right relative">
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === inv.id ? null : inv.id)}
                  className={`p-2 transition-all rounded-xl ${activeMenuId === inv.id ? 'text-gray-900 bg-gray-100' : 'text-gray-300 hover:text-gray-900'}`}
                >
                  <MoreVertical size={20} />
                </button>
                {activeMenuId === inv.id && (
                  <div className="absolute right-8 top-16 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-[70] p-2 animate-in zoom-in-95">
                     <button onClick={() => handleAction('Relocation', inv.product?.name)} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs">
                        <Move size={14} className="text-[#006666]" /> Relocate SKU
                     </button>
                     <button onClick={() => handleAction('Analytics View', inv.product?.name)} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors text-xs">
                        <BarChart2 size={14} className="text-blue-500" /> Item Analytics
                     </button>
                     <div className="h-px bg-gray-50 my-1" />
                     <button onClick={() => handleAction('Archival', inv.product?.name)} className="w-full text-left p-3 rounded-xl hover:bg-red-50 hover:text-red-500 flex items-center gap-3 transition-colors text-xs">
                        <Archive size={14} className="text-red-400" /> Archive SKU
                     </button>
                  </div>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Modal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
        title="Initialize New SKU" 
        subtitle="Global Product Registry Enrollment"
      >
        <form className="space-y-6 py-4" onSubmit={(e) => { e.preventDefault(); toast.success("SKU Draft Created"); setIsNewModalOpen(false); }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Name</label>
            <input required placeholder="e.g. Organic Avocados" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold appearance-none">
                <option>Produce</option>
                <option>Dairy</option>
                <option>Bakery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Initial Stock</label>
              <input type="number" required placeholder="0" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 outline-none focus:border-[#006666] font-bold" />
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start gap-4">
            <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
            <p className="text-xs font-bold text-emerald-800/70 leading-relaxed italic">System will automatically assign a unique SKU and bin location based on the selected category density.</p>
          </div>
          <Button fullWidth size="lg" className="rounded-2xl h-16">Register SKU</Button>
        </form>
      </Modal>

      {activeMenuId && <div className="fixed inset-0 z-[60]" onClick={() => setActiveMenuId(null)} />}
    </div>
  );
};

export default Inventory;
