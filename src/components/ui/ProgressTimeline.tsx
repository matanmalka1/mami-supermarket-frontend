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
  renderStepLabel?: (step: T, index: number, isDone: boolean) => React.ReactNode;
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
        className={`absolute top-1/2 left-0 right-0 h-1 ${connectorClassName} -z-20`}
      />
      {normalizedProgress && (
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 transition-[width]"
          style={{ width: normalizedProgress }}
        />
      )}
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, index) => {
          const isActive = activeStepId === step.id;
          const isComplete = step.done ?? isActive;
          const defaultIcon = step.icon ?? index + 1;
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-colors ${
                  isComplete
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-gray-300 border-gray-100"
                }`}
              >
                {renderStepIcon
                  ? renderStepIcon(step, index, isComplete)
                  : defaultIcon}
              </div>
              <div
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isComplete ? "text-emerald-600" : "text-gray-300"
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
