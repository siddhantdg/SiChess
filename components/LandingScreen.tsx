

import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';

interface LandingScreenProps {
  onSelectMode: (mode: 'pvc' | 'pvp') => void;
  onShowAbout: () => void;
  onAnalyze: () => void;
  onSpectate: () => void;
}

const taglines = [
  "A quiet game of calculated panic.",
  "Where even pawns dream big.",
  "Think ahead. Or pretend you did.",
  "A battle of wits on 64 squares.",
  "Blunders? All part of the plan."
];

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSelectMode, onShowAbout, onAnalyze, onSpectate }) => {
  const [activeTaglineIndex, setActiveTaglineIndex] = useState(0);
  const [previousTaglineIndex, setPreviousTaglineIndex] = useState<number | null>(null);
  const [isTaglineAnimating, setIsTaglineAnimating] = useState(false);
  const [startTitleAnimation, setStartTitleAnimation] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => setStartTitleAnimation(true), 100);

    const firstTaglineTimer = setTimeout(() => setIsTaglineAnimating(true), 1200);
    const interval = setInterval(() => {
      setActiveTaglineIndex(prevActiveIndex => {
        setPreviousTaglineIndex(prevActiveIndex);
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * taglines.length);
        } while (newIndex === prevActiveIndex);
        return newIndex;
      });
    }, 4000);
    
    return () => {
        clearTimeout(titleTimer);
        clearTimeout(firstTaglineTimer);
        clearInterval(interval);
    };
  }, []);

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

      <div className="text-center mb-40">
        <h1 
          className={`text-7xl md:text-8xl font-extrabold text-zinc-200 font-montserrat flex justify-center items-baseline ${startTitleAnimation ? 'animate-sichess-intro' : ''}`}
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          <span className={`si-part inline-block overflow-hidden whitespace-nowrap ${!startTitleAnimation ? 'max-w-0 opacity-0' : ''}`}>
            Si
          </span>
          <span className="chess-part inline-block">
            Chess
          </span>
        </h1>
        <div className="relative h-6 mt-2 overflow-hidden w-full">
          {taglines.map((tagline, index) => {
            const isActive = index === activeTaglineIndex;
            const isPrev = index === previousTaglineIndex;
            
            let transformClass = 'translate-y-full';
            let opacityClass = 'opacity-0';

            if (isTaglineAnimating) {
                if (isActive) {
                    transformClass = 'translate-y-0';
                    opacityClass = 'opacity-100';
                } else if (isPrev) {
                    transformClass = '-translate-y-full';
                    opacityClass = 'opacity-0';
                }
            }
            
            const finalClasses = `absolute inset-0 transition-all duration-1000 ease-in-out ${transformClass} ${opacityClass}`;

            return (
              <p key={index} className={`${finalClasses} text-base font-medium text-zinc-500`}>
                {tagline}
              </p>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-col w-full max-w-sm md:max-w-md space-y-4">
        <button
          onClick={() => onSelectMode('pvc')}
          className="w-full text-center py-4 px-6 rounded-full bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-xl font-semibold text-zinc-200 flex items-center justify-center space-x-3"
          aria-label="Start Player vs Computer game"
        >
          <Icons.Computer className="w-6 h-6" />
          <span>Player vs Computer</span>
        </button>

        <div className="flex w-full items-center gap-2.5">
          <button
            onClick={() => onSelectMode('pvp')}
            className="flex-grow-[5] flex-shrink basis-0 text-center py-3 px-5 rounded-full bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-lg font-semibold text-zinc-200 flex items-center justify-center space-x-2"
            aria-label="Start 2 Player game"
          >
            <Icons.TwoPlayers className="w-6 h-6" />
            <span className="whitespace-nowrap">2 Player</span>
          </button>
        
          <button
            onClick={onAnalyze}
            className="flex-grow-[4] flex-shrink basis-0 text-center py-3 px-4 rounded-full bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-lg font-semibold text-zinc-200 flex items-center justify-center space-x-2"
            aria-label="Analyze a game from PGN"
          >
            <Icons.Analyze className="w-6 h-6" />
            <span>Analyze</span>
          </button>

          <button
            onClick={onSpectate}
            className="flex-shrink-0 rounded-full bg-[#2a2a2c] hover:bg-[#3a3a3c] transition-colors duration-200 text-zinc-200 flex items-center justify-center p-3"
            aria-label="Spectate a game"
          >
            <Icons.Play className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};