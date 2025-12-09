import React from 'react';
import { Icons } from './Icons';
import { Piece } from 'chess.js';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { Timer } from './Timer';

interface OpponentInfoProps {
    capturedPieces: Piece[];
    materialAdvantage: number;
    playerName: string;
    isComputer: boolean;
    timeInSeconds: number | null;
    isTurn: boolean;
}

export const OpponentInfo: React.FC<OpponentInfoProps> = ({ capturedPieces, materialAdvantage, playerName, isComputer, timeInSeconds, isTurn }) => {
  return (
    <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-3">
            <div className="bg-[#2a2a2c] p-1.5 rounded-lg">
                {isComputer ? (
                    <Icons.Computer className="w-9 h-9 text-zinc-400" />
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
       {timeInSeconds !== null && <Timer timeInSeconds={timeInSeconds} isActive={isTurn} />}
    </div>
  );
};