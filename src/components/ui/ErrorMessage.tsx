import React from "react";

type ErrorMessageProps = {
  message?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
};

const baseClasses = "text-red-600 font-bold text-center";

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = "",
  icon,
}) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${baseClasses} ${className}`.trim()}
    >
      <span className="inline-flex items-center gap-2 justify-center">
        {icon}
        {message}
      </span>
    </div>
  );
};

export default ErrorMessage;
