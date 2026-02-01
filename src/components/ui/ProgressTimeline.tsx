import React from "react";

export type TimelineStep<TMeta = unknown> = {
  id: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  done?: boolean;
  meta?: TMeta;
};

export type ProgressTimelineProps<T extends TimelineStep> = {
  steps: readonly T[];
  activeStepId?: React.Key;
  progress?: number;
  connectorClassName?: string;
  className?: string;
  renderStepIcon?: (step: T, index: number, isDone: boolean) => React.ReactNode;
  renderStepLabel?: (
    step: T,
    index: number,
    isDone: boolean,
  ) => React.ReactNode;
};

const ProgressTimeline = <T extends TimelineStep>({
  steps,
  activeStepId,
  progress,
  connectorClassName = "bg-gray-100",
  className = "",
  renderStepIcon,
  renderStepLabel,
}: ProgressTimelineProps<T>) => {
  const normalizedProgress =
    progress === undefined
      ? undefined
      : `${Math.min(100, Math.max(0, progress))}%`;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute top-6 left-12 right-12 h-1 ${connectorClassName} -z-20 rounded-full`}
      />
      {normalizedProgress && (
        <div
          className="absolute top-6 left-12 h-1 bg-emerald-500 -z-10 transition-all duration-500 rounded-full"
          style={{ width: normalizedProgress }}
        />
      )}
      <div className="flex justify-between items-start relative z-10">
        {steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const isComplete = step.done ?? isActive;
          const defaultIcon = step.icon ?? index + 1;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-4 text-center flex-1"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 ${
                  isComplete
                    ? "bg-emerald-500 text-white border-emerald-500 scale-110"
                    : "bg-white text-gray-400 border-gray-200"
                }`}
              >
                {renderStepIcon
                  ? renderStepIcon(step, index, isComplete)
                  : defaultIcon}
              </div>
              <div
                className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 px-2 ${
                  isComplete ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {renderStepLabel
                  ? renderStepLabel(step, index, isComplete)
                  : step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTimeline;
