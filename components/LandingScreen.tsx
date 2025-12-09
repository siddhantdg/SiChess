import React from 'react';
import { Icons } from './Icons';

interface LandingScreenProps {
  onSelectMode: (mode: 'pvc' | 'pvp') => void;
  onShowAbout: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSelectMode, onShowAbout }) => {
  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center p-4 text-zinc-200 select-none animate-scale-in bg-[#121212] relative"
    >
      <button 
        onClick={onShowAbout}
        className="absolute top-6 right-6 text-[#62626b] hover:text-zinc-400 transition-colors"
        aria-label="About the application"
      >
        <Icons.Info className="w-8 h-8" />
      </button>

      <div className="text-center mb-24">
        <h1 
          className="text-8xl md:text-9xl font-extrabold text-zinc-200 font-montserrat"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          Chess
        </h1>
        <p className="mt-2 text-base font-medium text-zinc-500">
          A Classic Game of Strategy & Tactics
        </p>
      </div>
      
      <div className="flex flex-col w-full max-w-sm md:max-w-md space-y-4">
        <button
          onClick={() => onSelectMode('pvc')}
          className="w-full text-center py-4 px-6 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-xl font-semibold text-zinc-200"
          aria-label="Start Player vs Computer game"
        >
          Player vs Computer
        </button>
        
        <button
          onClick={() => onSelectMode('pvp')}
          className="w-full text-center py-4 px-6 rounded-2xl bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-xl font-semibold text-zinc-200"
          aria-label="Start Player vs Player game"
        >
          Player vs Player
        </button>
      </div>
    </div>
  );
};