import React, { useState } from 'react';
import Badge from '@/components/ui/Badge';
import { History, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { INITIAL_AUDIT_LOGS } from '@/constants';
import { sleep } from '@/utils/async';
import LoadingState from '@/components/shared/LoadingState';
import EmptyState from '@/components/shared/EmptyState';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    await sleep(1000);
    
    const olderLogs = [
      { id: Date.now() + 1, type: 'LOGISTICS', event: 'Route Optimized: Fleet A', user: 'System Scheduler', time: '5 hours ago', severity: 'low' },
      { id: Date.now() + 2, type: 'ADMIN', event: 'Catalog Sync Completed', user: 'Sarah Jenkins', time: '8 hours ago', severity: 'low' },
    ];
    
    setLogs([...logs, ...olderLogs]);
    setLoading(false);
    toast.success("Fetched 2 older entries from archive");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">System Audit</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Historical activity & security logs</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm"><History size={20} className="text-[#006666]" /></div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Activity Timeline</h3>
            <p className="text-[10px] text-gray-400 font-bold">Displaying last {logs.length} cluster logs</p>
          </div>
        </div>
        {loading ? (
          <LoadingState label="Synchronizing archive..." />
        ) : logs.length === 0 ? (
          <EmptyState title="No audit records" description="System audit log is empty." />
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {logs.map((log: any) => (
                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-xl transition-all group-hover:scale-110 ${log.severity === 'high' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      {log.type === 'SECURITY' ? <Shield size={20} /> : log.severity === 'high' ? <AlertTriangle size={20} /> : <UserCheck size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{log.event}</h4>
                      <p className="text-xs text-gray-400 font-medium">{log.user} • {log.time}</p>
                    </div>
                  </div>
                  <Badge variant={log.severity === 'high' ? 'red' : log.severity === 'mid' ? 'orange' : 'gray'}>
                    {log.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 text-center">
              <button 
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#006666] transition-colors disabled:opacity-50"
              >
                Load older entries
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
