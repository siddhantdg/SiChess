import React from 'react';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ease-in-out" aria-hidden="true" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#18181a] rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-zinc-700 animate-scale-in">
          <h2 className="text-3xl font-bold text-white mb-4">Quit Game?</h2>
          <p className="text-zinc-400 mb-8">Are you sure you want to quit? Your current game progress will be lost.</p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="w-full bg-[#2a2a2c] text-zinc-200 font-semibold py-3 rounded-xl hover:bg-[#3a3a3c] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-500 transition-colors duration-200"
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};