
import React from 'react';
import { Icons } from './Icons';
import { Piece } from 'chess.js';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { Timer } from './Timer';
import { Difficulty, PlayStyle } from '../types';

interface OpponentInfoProps {
    capturedPieces: Piece[];
    materialAdvantage: number;
    playerName: string;
    isComputer: boolean;
    timeInSeconds: number | null;
    isTurn: boolean;
    difficulty: Difficulty;
    analysisMode?: boolean;
    playStyle?: PlayStyle;
}

export const OpponentInfo: React.FC<OpponentInfoProps> = ({ capturedPieces, materialAdvantage, playerName, isComputer, timeInSeconds, isTurn, difficulty, analysisMode, playStyle }) => {
  const renderPlayerName = () => {
    if (isComputer) {
      const parts = playerName.split(' ');
      const elo = parts.pop();
      const label = parts.join(' ');
      
      if (elo && !isNaN(parseInt(elo))) {
        return (
          <h2 className="font-semibold text-lg text-zinc-200 flex items-center">
            {label}
            <span className="ml-2 text-sm font-normal text-zinc-400">{elo}</span>
            {playStyle === 'aggressive' && (
              <div className="ml-2 w-2 h-2 rounded-full bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]" title="Aggressive" />
            )}
            {playStyle === 'defensive' && (
              <div className="ml-2 w-2 h-2 rounded-full bg-[#40C4FF] shadow-[0_0_8px_#40C4FF]" title="Defensive" />
            )}
          </h2>
        );
      }
    }
    return <h2 className="font-semibold text-lg text-zinc-200">{playerName}</h2>;
  };

  return (
    <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
            <div className="bg-[#2a2a2c] p-1.5 rounded-lg">
                {isComputer ? (
                    <Icons.Computer className="w-9 h-9 text-zinc-400" />
                ) : (
                    <Icons.Player className="w-9 h-9 text-zinc-400" />
                )}
            </div>
            <div>
                {renderPlayerName()}
                 <CapturedPiecesDisplay
                    pieces={capturedPieces}
                    advantage={materialAdvantage < 0 ? Math.abs(materialAdvantage) : 0}
                />
            </div>
        </div>
       {!analysisMode && timeInSeconds !== null && <div className="relative -bottom-1"><Timer timeInSeconds={timeInSeconds} isActive={isTurn} /></div>}
    </div>
  );
};
