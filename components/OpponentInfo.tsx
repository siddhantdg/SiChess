
import React from 'react';
import { Icons } from './Icons';
import { Piece } from 'chess.js';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { Timer } from './Timer';
import { Difficulty } from '../types';

interface OpponentInfoProps {
    capturedPieces: Piece[];
    materialAdvantage: number;
    playerName: string;
    isComputer: boolean;
    timeInSeconds: number | null;
    isTurn: boolean;
    difficulty: Difficulty;
}

const difficultyIconUrls: Record<Difficulty, string> = {
  beginner: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png',
  intermediate: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png',
  advanced: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png',
  master: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png',
};

const DifficultyIcon: React.FC<{ difficulty: Difficulty; className: string }> = ({ difficulty, className }) => {
  const iconUrl = difficultyIconUrls[difficulty];
  if (iconUrl) {
    return <img src={iconUrl} alt={`${difficulty} difficulty`} className={className} />;
  }
  return <Icons.Computer className={className} />;
};


export const OpponentInfo: React.FC<OpponentInfoProps> = ({ capturedPieces, materialAdvantage, playerName, isComputer, timeInSeconds, isTurn, difficulty }) => {
  return (
    <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
            <div className="bg-[#2a2a2c] p-1.5 rounded-lg">
                {isComputer ? (
                    <DifficultyIcon difficulty={difficulty} className="w-9 h-9" />
                ) : (
                    <Icons.Player className="w-9 h-9 text-zinc-400" />
                )}
            </div>
            <div>
                <h2 className="font-semibold text-lg text-zinc-200">{playerName}</h2>
                 <CapturedPiecesDisplay
                    pieces={capturedPieces}
                    advantage={materialAdvantage < 0 ? Math.abs(materialAdvantage) : 0}
                />
            </div>
        </div>
       {timeInSeconds !== null && <div className="relative -bottom-1"><Timer timeInSeconds={timeInSeconds} isActive={isTurn} /></div>}
    </div>
  );
};
