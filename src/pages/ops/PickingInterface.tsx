
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Scale, Package } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import PickingHeader from '@/components/ops/PickingHeader';
import PickingFooter from '@/components/ops/PickingFooter';
import PickingItemRow from '@/components/ops/PickingItemRow';
import MissingItemModal from '@/components/ops/MissingItemModal';
import { usePicking } from '@/hooks/usePicking';
import { useWeightScale } from '@/hooks/useWeightScale';

const PickingInterface: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, items, loading, progress, updateItemStatus } = usePicking(id);
  const { weighingItem, setWeighingItem, currentWeight, setManualWeight, resetScale, isSimulated } = useWeightScale();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [missingItemId, setMissingItemId] = useState<string | null>(null);

  const handleUpdateStatus = async (itemId: string, status: string, reason?: string, replacement?: any) => {
    try {
      if (status === 'PICKED') {
        const item = items.find(i => i.id === itemId);
        if (item?.product?.category?.toLowerCase().includes('produce') && !weighingItem) {
          setWeighingItem(item);
          return;
        }
      }
      
      await updateItemStatus(itemId, status, reason, replacement?.id);
      setMissingItemId(null);
      resetScale();
      toast.success(status === 'PICKED' ? 'Item confirmed' : 'Shortage logged');
    } catch { 
      // Error handled in hook
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-gray-300 italic uppercase tracking-[0.3em]">Syncing Ops Cluster...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Deck
        </button>
        <Badge color="blue">Standard Picking Sequence</Badge>
      </div>

      <PickingHeader order={order} itemsCount={items.length} />

      <div className="bg-teal-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Package size={120} /></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0 border border-white/20">
            <Package size={32} className="text-teal-300" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-300">Operational Guidance</h4>
            <p className="text-xl font-bold italic pr-20 leading-tight">Please follow the bin sequence for maximum efficiency.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-50">
            {items.map((item: any) => (
              <PickingItemRow 
                key={item.id} 
                item={item} 
                isExpanded={expandedId === item.id} 
                onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                onUpdateStatus={(id, status) => handleUpdateStatus(id, status)}
                onReportMissing={(id) => setMissingItemId(id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PickingFooter items={items} progress={progress} onComplete={() => navigate('/')} />

      <Modal isOpen={!!weighingItem} onClose={resetScale} title="Produce Weight Check">
        <div className="py-10 space-y-8 text-center">
          <div className="relative inline-block">
            <div className="w-56 h-56 rounded-full border-8 transition-all flex flex-col items-center justify-center bg-gray-50 border-emerald-500">
               <Scale size={48} className="text-emerald-500" />
               <span className="text-5xl font-black italic tracking-tighter mt-2">{currentWeight} <span className="text-lg not-italic opacity-50">KG</span></span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black">{weighingItem?.product?.name}</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Expected: {(weighingItem?.quantity * 0.5).toFixed(2)} KG (approx)
            </p>
            {isSimulated && (
              <p className="text-[11px] text-amber-600 font-black uppercase tracking-widest">
                Simulated scale • enter weight manually
              </p>
            )}
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full bg-gray-50 border rounded-2xl p-4 font-black text-center"
            value={currentWeight || ""}
            onChange={(e) => setManualWeight(parseFloat(e.target.value))}
            placeholder="Enter measured weight (KG)"
          />
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={() => setManualWeight(0)}>
              Clear
            </Button>
            <Button
              variant="emerald"
              className="flex-1 rounded-2xl"
              disabled={currentWeight <= 0}
              onClick={() => handleUpdateStatus(weighingItem.id, 'PICKED')}
            >
              Confirm Weight
            </Button>
          </div>
        </div>
      </Modal>

      <MissingItemModal 
        itemId={missingItemId} 
        itemName={items.find(i => i.id === missingItemId)?.product?.name}
        onClose={() => setMissingItemId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default PickingInterface;
