
import React from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useNavigate } from 'react-router';
import StatCard from '@/components/ui/StatCard';
import Grid from '@/components/ui/Grid';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/shared/LoadingState';
import { Layers, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import OrderTable from '@/features/ops/components/OrderTable';
import { useOrders } from '@/hooks/useOrders';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading, selectedIds, toggleSelect } = useOrders();

  const startBatch = async () => {
    if (selectedIds.length < 2) return toast.error("Select at least 2 orders for a batch");
    toast.loading("Calculating fulfillment sequence...");
    setTimeout(() => {
      navigate(`/picking/batch-${selectedIds.join('-')}`);
      toast.dismiss();
    }, 1200);
  };

  if (loading) return <LoadingState label="Syncing orders..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tight">Orders Management</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {orders.length} ACTIVE CLUSTERS
          </p>
        </div>
        {selectedIds.length > 0 && (
          <Button 
            variant="emerald" 
            className="rounded-2xl h-14 px-8 shadow-xl animate-in slide-in-from-right-4"
            icon={<Layers size={20} />}
            onClick={startBatch}
          >
            Start Batch Pick ({selectedIds.length}) <Play size={16} className="ml-2 fill-current" />
          </Button>
        )}
      </div>

      <Grid cols={4} gap={6}>
        <StatCard label="Total Pending" value={orders.filter(o => o.status === 'PENDING').length} trend="-5%" />
        <StatCard label="Express Due" value="4" sub="Priority 1 Required" />
        <StatCard label="Batch Efficiency" value="+18%" trend="Optimal" />
        <StatCard label="Live Pickers" value="12" sub="Full Capacity" />
      </Grid>

      <OrderTable orders={orders} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
    </div>
  );
};

export default Dashboard;
