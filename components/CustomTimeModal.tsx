import React, { useState, useEffect } from 'react';

interface CustomTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetTime: (p1Minutes: number, p2Minutes: number) => void;
  initialP1: number;
  initialP2: number;
}

export const CustomTimeModal: React.FC<CustomTimeModalProps> = ({ isOpen, onClose, onSetTime, initialP1, initialP2 }) => {
  const [p1Time, setP1Time] = useState(String(initialP1));
  const [p2Time, setP2Time] = useState(String(initialP2));

  useEffect(() => {
    if (isOpen) {
      setP1Time(String(initialP1));
      setP2Time(String(initialP2));
    }
  }, [isOpen, initialP1, initialP2]);

  if (!isOpen) return null;

  const handleSet = () => {
    const p1 = parseInt(p1Time, 10);
    const p2 = parseInt(p2Time, 10);
    // Validation: ensure positive numbers, default to 1 if invalid, and cap at 99
    const validP1 = !isNaN(p1) && p1 > 0 ? Math.min(p1, 99) : 1;
    const validP2 = !isNaN(p2) && p2 > 0 ? Math.min(p2, 99) : 1;
    onSetTime(validP1, validP2);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 transition-opacity duration-300 ease-in-out"
      aria-hidden="true"
      onClick={onClose}
    >
      <div
        className="bg-[#18181a] rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-zinc-700 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Set Custom Time</h2>

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="p1Time" className="text-sm font-medium text-zinc-400 block mb-1">
              Player 1 Time (minutes)
            </label>
            <input
              id="p1Time"
              type="number"
              value={p1Time}
              onChange={(e) => setP1Time(e.target.value)}
              min="1"
              max="99"
              className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label htmlFor="p2Time" className="text-sm font-medium text-zinc-400 block mb-1">
              Player 2 Time (minutes)
            </label>
            <input
              id="p2Time"
              type="number"
              value={p2Time}
              onChange={(e) => setP2Time(e.target.value)}
              min="1"
              max="99"
              className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSet}
            className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200"
          >
            Set Time
          </button>
        </div>
      </div>
    </div>
  );
};