import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Grid from '../../components/ui/Grid';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ops/StatCard';
import { BarChart3, TrendingUp, DollarSign, Users, ShieldCheck } from 'lucide-react';

const ManagerAnalytics: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <PageHeader 
        title="Business Intelligence" 
        subtitle="Fiscal Year 2026 • Global Operations"
        icon={<BarChart3 size={24} />}
      />

      <div className="bg-emerald-950 rounded-[3rem] p-10 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 p-10 opacity-10"><ShieldCheck size={160} /></div>
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl shrink-0 border border-white/20">
          <ShieldCheck size={40} className="text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">System Status</h4>
          <p className="text-2xl font-bold italic pr-20 leading-tight">
            All operational clusters are performing within established quarterly parameters.
          </p>
        </div>
      </div>

      <Grid cols={4}>
        <StatCard label="Total Revenue" value="₪1.2M" trend="+12.4%" sub="Current Month" />
        <StatCard label="Avg. Ticket" value="₪284.00" trend="+4.1%" sub="Per Customer" />
        <StatCard label="Loyalty Growth" value="+152" trend="Active" sub="New Members" />
        <StatCard label="Waste Margin" value="2.1%" trend="-0.8%" sub="System Low" />
      </Grid>

      <div className="grid grid-cols-12 gap-10">
        <Card className="col-span-12 lg:col-span-8 p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic">Revenue Velocity</h3>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="h-64 flex items-end gap-2">
            {[40, 65, 30, 85, 90, 45, 100, 75, 60, 80, 55, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-50 hover:bg-emerald-100 rounded-t-xl transition-all relative group" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black italic">₪{h}k</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card variant="emerald" className="p-10 space-y-6">
             <DollarSign size={40} className="opacity-40" />
             <h3 className="text-3xl font-black italic">Quarterly Goal</h3>
             <p className="font-bold opacity-80 italic">We are ₪84,000 away from the Platinum Growth Milestone.</p>
             <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[82%] shadow-lg" />
             </div>
          </Card>
          <Card className="p-10 bg-blue-50 border-blue-100">
             <Users className="text-blue-600 mb-4" size={32} />
             <h4 className="font-black text-xl italic text-blue-900">Demographic Shift</h4>
             <p className="text-sm font-bold text-blue-800/60 leading-relaxed mt-2 italic">Younger clusters (24-34) are showing 25% higher engagement with Organic categories.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;