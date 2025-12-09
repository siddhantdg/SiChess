import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const difficultyOptions: { level: Difficulty; label: string; iconUrl: string }[] = [
  { level: 'beginner', label: 'Beginner', iconUrl: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' },
  { level: 'intermediate', label: 'Intermediate', iconUrl: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' },
  { level: 'advanced', label: 'Advanced', iconUrl: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' },
  { level: 'master', label: 'Master', iconUrl: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' },
];

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-green-600',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-orange-500',
  master: 'bg-red-600',
};


const DifficultyButton: React.FC<{
  label: string;
  iconUrl: string;
  isActive: boolean;
  activeClassName: string;
  onClick: () => void;
}> = ({ label, iconUrl, isActive, activeClassName, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181a] focus:ring-sky-500 ${
        isActive ? `${activeClassName} scale-110` : 'bg-[#2a2a2c] hover:bg-[#3a3a3c]'
      }`}
    >
      <img src={iconUrl} alt={label} className="w-8 h-8" />
    </button>
  );
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onSelectDifficulty }) => {
  return (
    <div className="flex justify-center space-x-4" role="group">
      {difficultyOptions.map(({ level, label, iconUrl }) => (
        <DifficultyButton
          key={level}
          label={label}
          iconUrl={iconUrl}
          isActive={selectedDifficulty === level}
          activeClassName={difficultyColors[level]}
          onClick={() => onSelectDifficulty(level)}
        />
      ))}
    </div>
  );
};