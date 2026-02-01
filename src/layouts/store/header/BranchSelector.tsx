import { useEffect, useRef, useState, type FC } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useBranchSelection } from "@/context/branch-context-core";

const BranchSelector: FC = () => {
  const { branches, selectedBranch, loading, error, selectBranch } =
    useBranchSelection();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const label = selectedBranch?.name || "Select branch";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[#008A45] hover:bg-gray-50 rounded-xl transition-all uppercase tracking-[0.3em]"
      >
        <MapPin size={16} className="text-[#008A45]" />
        <div className="text-left leading-tight">
          <span className="text-[8px] tracking-[0.5em] text-gray block">
            Deliver from
          </span>
          <span className="text-[11px] font-bold text-gray-900">{label}</span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50"
          role="listbox"
          aria-live="polite"
        >
          {loading ? (
            <div className="p-4 text-sm text-gray-500 font-bold text-center">
              Loading branches...
            </div>
          ) : error ? (
            <ErrorMessage
              message={error}
              className="text-sm font-bold text-center"
            />
          ) : branches.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 font-bold text-center">
              No active branches
            </div>
          ) : (
            branches.map((branch) => {
              const isActive = selectedBranch?.id === branch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    selectBranch(branch);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-emerald-50 text-[#008A45]" : "text-gray-600"
                  }`}
                >
                  <div className="text-sm">{branch.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                    {branch.address}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
