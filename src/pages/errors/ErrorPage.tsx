import React from "react";
import { useNavigate } from "react-router-dom";
import ErrorHero from "./components/ErrorHero";
import ErrorBody from "./components/ErrorBody";

interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  description?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = "403",
  title = "Restricted Access",
  description =
    "You don't have permission to view this section. This area is reserved for supermarket staff and administrators.",
}) => {
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/store", { replace: true });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <main className="mx-auto w-full max-w-3xl">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-100 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.1)]">
          <ErrorHero errorCode={errorCode} />
          <ErrorBody
            errorCode={errorCode}
            title={title}
            description={description}
            onGoHome={handleGoHome}
          />
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
