import React from "react";
import { Truck, Heart, Zap } from "lucide-react";
import AvatarBadge from "@/components/ui/AvatarBadge";

const SHELL_CLASS =
  "bg-white p-12 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.06)] space-y-16 border border-gray-50 hidden lg:block sticky top-24";
const HERO_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80";

const BENEFITS = [
  {
    title: "Track Orders",
    desc: "Stay updated on your delivery in real-time from the warehouse to your door.",
    icon: <Truck className="text-[#059669]" size={30} aria-hidden />,
  },
  {
    title: "Save Favorites",
    desc: "Build your weekly shopping list with one click and never forget your essentials.",
    icon: <Heart className="text-[#059669]" size={30} aria-hidden />,
  },
  {
    title: "Quick Checkout",
    desc: "Save your details for a faster shopping experience next time you visit.",
    icon: <Zap className="text-[#059669]" size={30} aria-hidden />,
  },
];

const RegistrationBenefits: React.FC = React.memo(() => {
  return (
    <aside className={SHELL_CLASS} aria-label="Registration benefits">
      <Hero />

      <div className="space-y-12 px-2">
        {BENEFITS.map((benefit) => (
          <Benefit key={benefit.title} {...benefit} />
        ))}
      </div>

      <SocialProof />
    </aside>
  );
});
RegistrationBenefits.displayName = "RegistrationBenefits";

const Hero = () => (
  <div className="relative h-[360px] rounded-[3rem] overflow-hidden group shadow-2xl">
    <img
      src={HERO_IMG}
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
      alt="Fresh community shopping together"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <h3 className="text-5xl leading-[0.9] text-white text-center tracking-tighter">
        Join the
        <br />
        Fresh Community
      </h3>
    </div>
  </div>
);

const Benefit: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <article className="flex gap-8 group cursor-default">
    <div className="w-20 h-20 bg-[#ECFDF5] rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0 shadow-sm border border-emerald-50">
      {icon}
    </div>
    <div className="space-y-2 pt-2">
      <h4 className="text-3xl text-gray-900 tracking-tighter leading-none">
        {title}
      </h4>
      <p className="text-[15px] text-gray-400 leading-relaxed font-bold">
        {desc}
      </p>
    </div>
  </article>
);

const SocialProof = () => (
  <div className="pt-10 border-t border-gray-50 flex items-center gap-6 px-2">
    <AvatarCluster />
    <div>
      <p className="text-[10px] text-gray-300 leading-tight uppercase tracking-widest">
        Global Reach
      </p>
      <p className="text-xs font-bold text-gray-400 leading-tight uppercase tracking-widest mt-0.5">
        Over 5,000 customers
        <br />
        already shopping fresh!
      </p>
    </div>
  </div>
);

const AvatarCluster = () => (
  <div className="flex -space-x-4" aria-label="Top customers">
    {["Alma R.", "Nora K.", "Liam T."].map((name) => (
      <AvatarBadge
        key={name}
        name={name}
        size={56}
        className="border-4 border-white shadow-lg bg-emerald-50 text-emerald-700"
      />
    ))}
    <div className="w-14 h-14 bg-emerald-50 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-emerald-700 shadow-lg">
      5k+
    </div>
  </div>
);

export default RegistrationBenefits;
