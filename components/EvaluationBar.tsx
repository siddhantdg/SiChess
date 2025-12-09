import React from 'react';

interface EvaluationBarProps {
  evaluation: number;
  isLoading: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation, isLoading }) => {
  // Clamp evaluation between -10 and 10 for visualization
  const clampedEval = Math.max(-10, Math.min(10, evaluation));
  // Convert evaluation to a percentage (50% is equal)
  const whiteAdvantagePercent = 50 + clampedEval * 5;

  return (
    <div className="w-full bg-zinc-800 h-3 rounded-md flex items-center relative overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-500 ease-out"
        style={{ width: `${whiteAdvantagePercent}%` }}
      />
       {isLoading && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
    </div>
  );
};