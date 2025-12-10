import React from 'react';

interface EvaluationBarProps {
  evaluation: number;
  isLoading: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ evaluation, isLoading }) => {
  const clampedEval = Math.max(-10, Math.min(10, evaluation));
  const whiteAdvantagePercent = 50 + clampedEval * 5;

  return (
    <div className="w-full bg-zinc-800 h-3 rounded-md flex items-center relative overflow-hidden">
      <div
        className="h-full bg-white"
        style={{ 
          width: `${whiteAdvantagePercent}%`,
          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
       {isLoading && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
    </div>
  );
};