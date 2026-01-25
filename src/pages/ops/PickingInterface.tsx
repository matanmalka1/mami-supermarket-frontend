import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PickingHeader from '@/components/ops/PickingHeader';
import PickingFooter from '@/components/ops/PickingFooter';
import MissingItemModal from '@/components/ops/MissingItemModal';
import { usePicking } from '@/hooks/usePicking';
import { useWeightScale } from '@/hooks/useWeightScale';
import PickingGuidanceCard from '@/pages/ops/components/PickingGuidanceCard';
import PickingItemsTable from '@/pages/ops/components/PickingItemsTable';
import PickingScaleModal from '@/pages/ops/components/PickingScaleModal';
import { useParams, useNavigate } from 'react-router';
const PickingInterface: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    order,
    items,
    loading,
    error,
    progress,
    updateItemStatus,
    refresh,
  } = usePicking(id);
  const { weighingItem, setWeighingItem, currentWeight, setManualWeight, resetScale, isSimulated } =
    useWeightScale();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [missingItemId, setMissingItemId] = useState<string | null>(null);

  const handleToggleRow = (rowId: string) => {
    setExpandedId((prev) => (prev === rowId ? null : rowId));
  };
  const handleUpdateStatus = async (
    itemId: string,
    status: string,
    reason?: string,
    replacement?: any,
  ) => {
    try {
      if (status === 'PICKED') {
        const item = items.find((i) => i.id === itemId);
        if (
          item?.product?.category?.toLowerCase().includes('produce') &&
          !weighingItem
        ) {
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

  const handleReportDamage = async (itemId: string) => {
    try {
      await updateItemStatus(itemId, 'MISSING', 'Damage reported');
      toast.success('Damage report submitted');
    } catch {
      toast.error('Failed to report damage');
    }
  };

  const handleWeightConfirm = () => {
    if (weighingItem) {
      handleUpdateStatus(weighingItem.id, 'PICKED');
    }
  };
  if (loading) {
    return (
      <div className="p-20 text-center animate-pulse font-black text-gray-300 italic uppercase tracking-[0.3em]">
        Loading picking data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-20 text-center space-y-4">
        <p className="text-red-600 font-black uppercase tracking-[0.3em]">
          {error}
        </p>
        <Button variant="emerald" onClick={refresh}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Deck
        </button>
        <Badge color="blue">Standard Picking Sequence</Badge>
      </div>

      <PickingHeader order={order} itemsCount={items.length} />

      <PickingGuidanceCard />

      <PickingItemsTable
        items={items}
        expandedId={expandedId}
        onToggle={handleToggleRow}
        onUpdateStatus={handleUpdateStatus}
        onReportMissing={(id) => setMissingItemId(id)}
        onReportDamage={handleReportDamage}
      />

      <PickingFooter
        items={items}
        progress={progress}
        onComplete={() => navigate('/')}
        onSync={refresh}
      />

      <PickingScaleModal
        isOpen={!!weighingItem}
        weighingItem={weighingItem}
        currentWeight={currentWeight}
        isSimulated={isSimulated}
        onClose={resetScale}
        setManualWeight={setManualWeight}
        onConfirm={handleWeightConfirm}
      />

      <MissingItemModal
        itemId={missingItemId}
        itemName={items.find((i) => i.id === missingItemId)?.product?.name}
        onClose={() => setMissingItemId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default PickingInterface;
