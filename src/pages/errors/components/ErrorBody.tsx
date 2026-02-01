import React from "react";

interface ErrorBodyProps {
  errorCode: string;
  title: string;
  description: string;
  onGoHome: () => void;
}

const ErrorBody: React.FC<ErrorBodyProps> = ({
  errorCode,
  title,
  description,
  onGoHome,
}) => {
  const isForbidden = errorCode === "403";

  return (
    <div className="rounded-b-[2rem] border-t border-slate-100 bg-white px-8 pb-10 pt-8 text-center">
      <div className="text-[0.65rem] uppercase tracking-[0.6em] text-emerald-500">
        {isForbidden ? "Restricted access" : "Page not found"}
      </div>
      <h1 className="mt-5 text-3xl  text-slate-900 md:text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-slate-500 md:text-base">{description}</p>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onGoHome}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-10 py-3 text-sm uppercase tracking-[0.4em] text-white shadow-xl transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Back to home
        </button>
      </div>

      <p className="mt-8 text-[0.6rem] uppercase tracking-[0.5em] text-slate-400">
        © 2026 Mami Supermarket. All rights reserved.
      </p>
    </div>
  );
};

export default ErrorBody;
