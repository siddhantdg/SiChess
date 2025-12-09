
import React from 'react';

interface AnalysisLoadingModalProps {
  isOpen: boolean;
  progress: number;
}

export const AnalysisLoadingModal: React.FC<AnalysisLoadingModalProps> = ({ isOpen, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#18181a] rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-4">Analyzing Game...</h2>
        <p className="text-zinc-400 mb-6">Please wait while we review every move.</p>
        <div className="w-full bg-[#2a2a2c] rounded-full h-4 overflow-hidden">
          <div
            className="bg-sky-600 h-4 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold text-zinc-200 mt-4">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};
