
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Difficulty } from '../types';
import { DifficultySelector } from './DifficultySelector';

interface NameInputModalProps {
  mode: 'pvc' | 'pvp';
  isOpen: boolean;
  onStart: (names: { player1: string; player2: string }, colorPref?: 'w' | 'b' | 'random', difficulty?: Difficulty) => void;
  onClose: () => void;
}

const ColorIconButton: React.FC<{
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  ariaLabel: string;
}> = ({ icon, isSelected, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181a] focus:ring-sky-500 ${
      isSelected ? 'bg-sky-600 scale-110' : 'bg-[#2a2a2c] hover:bg-[#3a3a3c]'
    }`}
  >
    {icon}
  </button>
);


export const NameInputModal: React.FC<NameInputModalProps> = ({ mode, isOpen, onStart, onClose }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [colorPref, setColorPref] = useState<'w' | 'b' | 'random'>('random');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  useEffect(() => {
    if (mode === 'pvc') {
      setPlayer1Name('Player');
      setPlayer2Name('Computer');
      setColorPref('random');
      setDifficulty('intermediate');
    } else {
      setPlayer1Name('White');
      setPlayer2Name('Black');
    }
  }, [mode]);

  if (!isOpen) return null;

  const handleStart = () => {
    onStart(
      {
        player1: player1Name.trim() || (mode === 'pvc' ? 'Player' : 'White'),
        player2: mode === 'pvc' ? 'Computer' : (player2Name.trim() || 'Black'),
      },
      mode === 'pvc' ? colorPref : undefined,
      mode === 'pvc' ? difficulty : undefined
    );
  };

  const colorDisplayNames: Record<'w' | 'b' | 'random', string> = {
    w: 'White',
    b: 'Black',
    random: 'Random',
  };

  const difficultyDisplayNames: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Expert',
    master: 'Grandmaster',
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
          {mode === 'pvc' ? 'Game Setup' : 'Enter Player Names'}
        </h2>

        {mode === 'pvc' && (
          <div className="space-y-8 mb-8">
            <div>
                <div className="flex items-center text-sm font-medium text-zinc-400 mb-3 px-1">
                    <span className="w-1/2 text-right pr-0.5">Play as</span>
                    <span className="w-1/2 text-left pl-0.5 font-semibold text-white">{colorDisplayNames[colorPref]}</span>
                </div>
                <div className="flex justify-center space-x-4">
                <ColorIconButton
                    icon={<Icons.KingWhite className="w-8 h-8" />}
                    isSelected={colorPref === 'w'}
                    onClick={() => setColorPref('w')}
                    ariaLabel="Play as white"
                />
                <ColorIconButton
                    icon={<Icons.KingRandom className="w-8 h-8" />}
                    isSelected={colorPref === 'random'}
                    onClick={() => setColorPref('random')}
                    ariaLabel="Play as a random color"
                />
                <ColorIconButton
                    icon={<Icons.KingBlack className="w-8 h-8" />}
                    isSelected={colorPref === 'b'}
                    onClick={() => setColorPref('b')}
                    ariaLabel="Play as black"
                />
                </div>
            </div>
            <div>
                 <div className="flex items-center text-sm font-medium text-zinc-400 mb-3 px-1">
                    <span className="w-1/2 text-right pr-0.5">Difficulty</span>
                    <span className="w-1/2 text-left pl-0.5 font-semibold text-white">{difficultyDisplayNames[difficulty]}</span>
                </div>
                <DifficultySelector selectedDifficulty={difficulty} onSelectDifficulty={setDifficulty} />
            </div>
          </div>
        )}

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="player1" className="text-sm font-medium text-zinc-400 block mb-3">
              {mode === 'pvc' ? 'Your Name' : 'Player 1 (White)'}
            </label>
            <input
              id="player1"
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder={mode === 'pvc' ? 'Player' : 'White'}
              className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          {mode === 'pvp' && (
            <div>
              <label htmlFor="player2" className="text-sm font-medium text-zinc-400 block mb-3">
                Player 2 (Black)
              </label>
              <input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Black"
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
