import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

interface MatchStartAnimationProps {
  onAnimationEnd: () => void;
  player1Name: string;
  player2Name: string;
  gameMode: 'pvc' | 'pvp';
}

export const MatchStartAnimation: React.FC<MatchStartAnimationProps> = ({ onAnimationEnd, player1Name, player2Name, gameMode }) => {
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

  return (
    <div
      className={`fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center space-y-8 transition-opacity duration-500 ease-in-out ${
        animationStep === 'exiting' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className={playerClasses}>
        <div className="bg-[#2a2a2c] p-3 rounded-xl">
          <Icons.Player className="w-16 h-16 text-zinc-200" />
        </div>
        <h2 className="font-bold text-4xl text-zinc-200">{player1Name}</h2>
      </div>

      <span
        className={`text-5xl font-bold text-zinc-500 transition-all duration-500 delay-500 transform ${
          animationStep === 'entering' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}
      >
        VS
      </span>

      <div className={opponentClasses}>
         <h2 className="font-bold text-4xl text-zinc-200">{player2Name}</h2>
         <div className="bg-[#2a2a2c] p-3 rounded-xl">
          {gameMode === 'pvc' ? (
            <Icons.Computer className="w-16 h-16 text-zinc-200" />
          ) : (
            <Icons.Player className="w-16 h-16 text-zinc-200" />
          )}
        </div>
      </div>
    </div>
  );
};