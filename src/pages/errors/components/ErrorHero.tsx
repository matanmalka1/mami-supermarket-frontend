import React from "react";

interface ErrorHeroProps {
  errorCode: string;
}

const ErrorHero: React.FC<ErrorHeroProps> = ({ errorCode }) => {
  const isForbidden = errorCode === "403";
  const statusCopy = isForbidden ? "restricted access" : "missing page";

  return (
    <div className="rounded-t-[2rem] bg-gradient-to-b from-emerald-100/80 via-emerald-50 to-white px-8 pt-10 pb-8 text-center border-b border-white/60">
      <p className="text-[0.65rem] uppercase tracking-[0.8em] text-emerald-500">
        Mami Supermarket
      </p>
      <div className="mt-4 text-5xl  text-gray-900">{errorCode}</div>
      <p className="mt-2 text-xs uppercase tracking-[0.5em] text-gray-400">
        Error state
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white shadow-xl">
          <svg
            className="h-7 w-7 text-emerald-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </div>
        <p className="text-sm text-gray-900">{statusCopy}</p>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
          Operations intelligence
        </p>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        {isForbidden
          ? "You do not have clearance for this area. Contact Admin Ops if you believe your role should have access."
          : "The route you tried to load either moved or no longer exists. Head back to the storefront to continue shopping."}
      </p>
    </div>
  );
};

export default ErrorHero;
