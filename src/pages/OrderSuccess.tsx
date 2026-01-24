
import React from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useParams, Link } from 'react-router';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderSuccess: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-12">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20" />
        <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 size={64} />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter">Ordered Successfully!</h1>
        <p className="text-xl text-gray-500 font-bold">Order ID: <span className="text-[#008A45]">{id}</span></p>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          Your items are now being routed to our optimized picking queue. 
          We'll notify you when they are out for delivery.
        </p>
      </div>

      <div className="bg-white border rounded-[3rem] p-12 shadow-xl space-y-10">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10" />
          <div className="absolute top-1/2 left-0 w-1/4 h-1 bg-emerald-500 -z-10" />
          {[
            { icon: <Package size={20} />, label: 'Confirmed', active: true },
            { icon: <CheckCircle2 size={20} />, label: 'Picking', active: false },
            { icon: <Truck size={20} />, label: 'En Route', active: false },
            { icon: <Home size={20} />, label: 'Delivered', active: false },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm ${s.active ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-300 border-gray-100'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${s.active ? 'text-emerald-600' : 'text-gray-300'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 max-w-md mx-auto">
        <Link to="/store" className="flex-1">
          <Button variant="outline" className="w-full h-16 rounded-2xl font-black italic">
            Keep Shopping
          </Button>
        </Link>
        <Link to="/" className="flex-1">
          <Button className="w-full h-16 rounded-2xl font-black italic">
            Track Order
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
