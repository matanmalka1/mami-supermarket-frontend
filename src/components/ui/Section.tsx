import React from "react";
import { ArrowRight } from "lucide-react";
/* Fix: Import from react-router instead of react-router-dom to resolve missing export error */
import { Link } from "react-router";

interface SectionProps {
  title?: string;
  // Change: Update subtitle from string to React.ReactNode to allow rich content like icons in headers
  subtitle?: React.ReactNode;
  linkTo?: string;
  linkLabel?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "contained" | "deals";
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  linkTo,
  linkLabel = "View All",
  children,
  className = "",
  variant = "default",
}) => {
  const variants = {
    default: "space-y-12",
    contained:
      "bg-gray-50/50 rounded-3xl p-12 border border-gray-100 space-y-10",
    deals: "bg-orange-50 rounded-3xl p-12 border border-orange-100 space-y-10",
  };

  return (
    <section className={`${variants[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-end justify-between border-b border-gray-100 pb-8">
          <div className="space-y-1">
            {title && (
              <h2 className="text-3xl md:text-5xl text-gray-900 tracking-tight ">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                {subtitle}
              </p>
            )}
          </div>
          {linkTo && (
            <Link
              to={linkTo}
              className="bg-white/50 border border-gray-100 px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest text-gray-400 hover:bg-[#008A45] hover:text-white hover:border-[#008A45] transition-all"
            >
              {linkLabel} <ArrowRight size={14} className="inline ml-1" />
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
