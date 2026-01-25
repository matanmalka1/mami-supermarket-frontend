import React from "react";
import { ShoppingBag } from "lucide-react";

const LoginHero: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
      className="absolute inset-0 w-full h-full object-cover"
      alt="Hero"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col justify-center px-20 text-white space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#008A45] rounded-xl flex items-center justify-center">
          <ShoppingBag size={28} />
        </div>
        <span className="text-3xl font-black italic">FreshMarket</span>
      </div>
      <h1 className="text-6xl font-black leading-[1.1]">
        Quality produce,
        <br />
        delivered to your doorstep.
      </h1>
      <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-xs">
        <p className="text-xs font-black uppercase tracking-widest text-emerald-300 mb-2">
          Internal Access Nodes
        </p>
        <p className="text-sm font-medium">
          Admin:{" "}
          <span className="font-black italic text-teal-300">
            admin@mami.com
          </span>
        </p>
        <p className="text-sm font-medium">
          Customer: <span className="font-black italic">user@mami.com</span>
        </p>
      </div>
    </div>
  </div>
);

export default LoginHero;
