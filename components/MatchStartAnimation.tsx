import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Difficulty, getDifficultyDetails } from '../types';

interface MatchStartAnimationProps {
  onAnimationEnd: () => void;
  player1Name: string;
  player2Name: string;
  gameMode: 'pvc' | 'pvp' | 'cvc';
  difficulty: Difficulty;
}

export const MatchStartAnimation: React.FC<MatchStartAnimationProps> = ({ onAnimationEnd, player1Name, player2Name, gameMode, difficulty }) => {
  const [animationStep, setAnimationStep] = useState<'initial' | 'entering' | 'exiting'>('initial');

  useEffect(() => {
    const enterTimer = setTimeout(() => setAnimationStep('entering'), 100);
    const exitTimer = setTimeout(() => setAnimationStep('exiting'), 2200);
    const endTimer = setTimeout(onAnimationEnd, 2800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(endTimer);
    };
  }, [onAnimationEnd]);

  const playerClasses = `flex items-center space-x-4 transition-all duration-700 ease-out transform ${
    animationStep === 'entering' ? 'translate-x-0 opacity-100' : '-translate-x-1/2 opacity-0'
  }`;
  
  const opponentClasses = `flex items-center space-x-4 transition-all duration-700 ease-out transform ${
    animationStep === 'entering' ? 'translate-x-0 opacity-100' : 'translate-x-1/2 opacity-0'
  }`;

  const getEngineLabel = (fullName: string) => {
    const parts = fullName.split(' ');
    // If the last part is a number (ELO), remove it.
    if (parts.length > 1 && !isNaN(parseInt(parts[parts.length - 1]))) {
      parts.pop();
    }
    return parts.join(' ');
  };

  const displayPlayer1Name = gameMode === 'cvc' ? getEngineLabel(player1Name) : player1Name;

  const displayPlayer2Name =
    gameMode === 'pvc'
      ? getDifficultyDetails(difficulty).label
      : gameMode === 'cvc'
      ? getEngineLabel(player2Name)
      : player2Name;


  return (
    <div
      className={`fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center space-y-8 transition-opacity duration-500 ease-in-out ${
        animationStep === 'exiting' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className={playerClasses}>
        <div className="bg-[#2a2a2c] p-3 rounded-xl">
          {gameMode === 'cvc' ? (
              <Icons.Computer className="w-16 h-16 text-zinc-200" />
          ) : (
              <Icons.Player className="w-16 h-16 text-zinc-200" />
          )}
        </div>
        <h2 className="font-bold text-4xl text-zinc-200">{displayPlayer1Name}</h2>
      </div>

      <span
        className={`text-5xl font-bold text-zinc-500 transition-all duration-500 delay-500 transform ${
          animationStep === 'entering' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        VS
      </span>

      <div className={opponentClasses}>
         <h2 className="font-bold text-4xl text-zinc-200">{displayPlayer2Name}</h2>
         <div className="bg-[#2a2a2c] p-3 rounded-xl">
          {gameMode === 'pvc' || gameMode === 'cvc' ? (
            <Icons.Computer className="w-16 h-16 text-zinc-200" />
          ) : (
            <Icons.Player className="w-16 h-16 text-zinc-200" />
          )}
        </div>
      </div>
    </div>
  );
};
