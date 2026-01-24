import React, { useState, useEffect } from 'react';
import StatCard from '../components/ops/StatCard';
import Grid from '../components/ui/Grid';
import Button from '../components/ui/Button';
import { Trophy, Timer, Zap, Award, Play, Pause } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffPerformance: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [pickProgress, setPickProgress] = useState(842);
  const [avgTime, setAvgTime] = useState(1.4);

  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => {
        setPickProgress(p => Math.min(1000, p + (Math.random() > 0.7 ? 1 : 0)));
        setAvgTime(t => parseFloat((t - 0.001 * (Math.random() - 0.3)).toFixed(2)));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
    toast(isLive ? "Live telemetry paused" : "Syncing live picker telemetry...", { icon: isLive ? '⏸️' : '📡' });
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex items-end justify-between border-b pb-8">
        <div>
          <h1 className="text-5xl font-black italic text-gray-900 tracking-tighter">Performance Hub</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Operational Analytics • Sarah Jenkins</p>
        </div>
        <div className="flex items-center gap-4">
           <Button 
             onClick={toggleLive}
             variant={isLive ? 'outline' : 'primary'}
             className="rounded-2xl h-14 px-6 border-emerald-100"
             icon={isLive ? <Pause size={18} /> : <Play size={18} />}
           >
             {isLive ? 'Pause Sync' : 'Go Live'}
           </Button>
           <div className="flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black italic shadow-lg shadow-emerald-500/20">
             <Trophy size={20} /> Shift Rank: #2
           </div>
        </div>
      </div>

      <Grid cols={4} gap={6}>
        <StatCard label="Avg. Pick Time" value={`${avgTime}m`} trend="-12s improvement" />
        <StatCard label="Accuracy Rate" value="99.8%" sub="0.2% mis-picks" />
        <StatCard label="Items per Shift" value={pickProgress.toString()} trend="+40 from yesterday" />
        <StatCard label="Path Efficiency" value="94%" sub="Top Tier" />
      </Grid>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black italic flex items-center gap-3"><Timer size={24} className="text-[#006666]" /> Shift Velocity</h3>
             <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-300">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-teal-500" /> Target</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-200" /> Actual</span>
             </div>
          </div>
          <div className="h-64 flex items-end gap-4 px-4">
            {[65, 80, 45, 90, 70, 85, 95].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-gray-50 rounded-t-2xl relative overflow-hidden transition-all group-hover:bg-gray-100" style={{ height: '100%' }}>
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-2xl transition-all duration-1000 ${isLive ? 'animate-pulse' : ''}`} style={{ height: `${h}%` }}>
                    <div className="absolute top-2 left-0 right-0 text-[8px] font-black text-white text-center opacity-0 group-hover:opacity-100">{h}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400">{i + 8}:00</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-[#006666] text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <Award size={180} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-300 mb-6">Active Milestone</h4>
              <div className="space-y-2">
                <p className="text-3xl font-black italic">Speedster IV</p>
                <p className="text-sm font-medium text-teal-100/60">Complete 1,000 picks under 90 seconds to unlock your next reward.</p>
              </div>
              <div className="mt-10 space-y-3">
                 <div className="flex justify-between text-xs font-black"><span>Progress</span><span>{pickProgress} / 1000</span></div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-300 transition-all duration-700" style={{ width: `${(pickProgress / 1000) * 100}%` }} />
                 </div>
              </div>
           </div>

           <div className="bg-orange-50 border border-orange-100 p-10 rounded-[3rem] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2"><Zap size={14} /> Optimization Pro-Tip</h4>
              <p className="text-sm font-bold text-orange-900/60 leading-relaxed italic">"Try picking heavy canned goods from Zone B first to improve cart stability and speed up produce bagging in Zone A."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;