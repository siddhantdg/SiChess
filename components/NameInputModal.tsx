import React, { useState, useEffect } from 'react';

interface NameInputModalProps {
  mode: 'pvc' | 'pvp';
  isOpen: boolean;
  onStart: (names: { player1: string; player2: string }) => void;
  onClose: () => void;
}

export const NameInputModal: React.FC<NameInputModalProps> = ({ mode, isOpen, onStart, onClose }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');

  useEffect(() => {
    if (mode === 'pvc') {
      setPlayer1Name('Player');
      setPlayer2Name('Computer');
    } else {
      setPlayer1Name('Player 1');
      setPlayer2Name('Player 2');
    }
  }, [mode]);

  if (!isOpen) return null;

  const handleStart = () => {
    onStart({
      player1: player1Name.trim() || (mode === 'pvc' ? 'Player' : 'Player 1'),
      player2: mode === 'pvc' ? 'Computer' : (player2Name.trim() || 'Player 2'),
    });
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
        <h2 className="text-3xl font-bold text-white mb-6">
          {mode === 'pvc' ? 'Enter Your Name' : 'Enter Player Names'}
        </h2>

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="player1" className="text-sm font-medium text-zinc-400 block mb-1">
              {mode === 'pvc' ? 'Name' : 'Player 1 (White)'}
            </label>
            <input
              id="player1"
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder={mode === 'pvc' ? 'Player' : 'Player 1'}
              className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          {mode === 'pvp' && (
            <div>
              <label htmlFor="player2" className="text-sm font-medium text-zinc-400 block mb-1">
                Player 2 (Black)
              </label>
              <input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Player 2"
                className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleStart}
            className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};