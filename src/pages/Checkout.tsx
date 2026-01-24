
import React, { useState } from 'react';
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { Truck, Store, Calendar, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { currencyILS } from '../utils/format';
import { sleep } from '../utils/async';

type Step = 'FULFILLMENT' | 'SCHEDULE' | 'PAYMENT';

const SLOTS = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('FULFILLMENT');
  const [method, setMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await sleep(2000);
    clearCart();
    navigate('/store/order-success/ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  if (items.length === 0 && !loading) {
    navigate('/store');
    return null;
  }

  const deliveryFee = total > 250 ? 0 : 15;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
        {['FULFILLMENT', 'SCHEDULE', 'PAYMENT'].map((s, i) => (
          <div key={s} className="bg-white px-4 flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black transition-all ${
              step === s ? 'border-[#008A45] bg-[#008A45] text-white scale-110 shadow-lg' : 
              i < ['FULFILLMENT', 'SCHEDULE', 'PAYMENT'].indexOf(step) ? 'border-[#008A45] bg-white text-[#008A45]' : 'border-gray-100 bg-white text-gray-300'
            }`}>
              {i < ['FULFILLMENT', 'SCHEDULE', 'PAYMENT'].indexOf(step) ? <CheckCircle2 size={24} /> : i + 1}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-[#008A45]' : 'text-gray-300'}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-[3rem] p-12 shadow-xl space-y-10 min-h-[500px]">
        {step === 'FULFILLMENT' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black italic">How would you like your groceries?</h2>
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => setMethod('DELIVERY')} className={`p-10 rounded-[2.5rem] border-4 transition-all text-left space-y-4 ${method === 'DELIVERY' ? 'border-[#008A45] bg-emerald-50/50' : 'border-gray-50 hover:border-gray-200'}`}>
                <Truck size={40} className={method === 'DELIVERY' ? 'text-[#008A45]' : 'text-gray-300'} />
                <div><h3 className="text-xl font-black italic">Home Delivery</h3><p className="text-sm text-gray-500 font-bold">Directly to your doorstep</p></div>
              </button>
              <button onClick={() => setMethod('PICKUP')} className={`p-10 rounded-[2.5rem] border-4 transition-all text-left space-y-4 ${method === 'PICKUP' ? 'border-[#008A45] bg-emerald-50/50' : 'border-gray-50 hover:border-gray-200'}`}>
                <Store size={40} className={method === 'PICKUP' ? 'text-[#008A45]' : 'text-gray-300'} />
                <div><h3 className="text-xl font-black italic">Store Pickup</h3><p className="text-sm text-gray-500 font-bold">Pick up from nearest branch</p></div>
              </button>
            </div>
            <Button size="lg" className="w-full h-20 rounded-[1.5rem]" onClick={() => setStep('SCHEDULE')}>Continue to Schedule <ChevronRight className="ml-2" /></Button>
          </div>
        )}

        {step === 'SCHEDULE' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black italic">Pick a time slot</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SLOTS.map(s => (
                <button key={s} onClick={() => setSlot(s)} className={`p-6 rounded-2xl border-2 font-bold text-sm transition-all ${slot === s ? 'border-[#008A45] bg-emerald-50 text-[#008A45]' : 'border-gray-50 hover:border-gray-200 text-gray-400'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 h-16" onClick={() => setStep('FULFILLMENT')}>Back</Button>
              <Button size="lg" className="flex-[2] h-16 rounded-2xl" disabled={!slot} onClick={() => setStep('PAYMENT')}>Go to Payment</Button>
            </div>
          </div>
        )}

        {step === 'PAYMENT' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-black italic">Final Payment</h2>
            <div className="p-8 bg-gray-50 rounded-3xl space-y-6 border border-gray-100">
               <div className="flex justify-between items-center font-bold text-gray-500 uppercase text-xs tracking-widest border-b pb-6">
                  <span>Order Summary</span>
                  <span>{items.length} Items</span>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between font-bold text-gray-900"><span>Subtotal</span><span>{currencyILS(total)}</span></div>
                 <div className="flex justify-between font-bold text-emerald-600"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : currencyILS(deliveryFee)}</span></div>
                 <div className="flex justify-between text-2xl font-black italic pt-4 border-t"><span>Total</span><span>{currencyILS(total + deliveryFee)}</span></div>
               </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Card Details</label>
              <div className="relative">
                <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-6 pl-16 pr-6 font-mono text-lg focus:border-[#008A45] outline-none transition-all" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1 h-16" onClick={() => setStep('SCHEDULE')}>Back</Button>
              <Button size="lg" className="flex-[2] h-16 rounded-2xl" loading={loading} onClick={handleComplete}>Confirm & Pay {currencyILS(total + deliveryFee)}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
