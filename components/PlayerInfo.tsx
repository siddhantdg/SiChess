import React from 'react';
import { Icons } from './Icons';
import { Piece } from 'chess.js';
import { CapturedPiecesDisplay } from './CapturedPiecesDisplay';
import { Timer } from './Timer';

interface PlayerInfoProps {
    capturedPieces: Piece[];
    materialAdvantage: number;
    playerName: string;
    timeInSeconds: number | null;
    isTurn: boolean;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ capturedPieces, materialAdvantage, playerName, timeInSeconds, isTurn }) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center space-x-3">
        <div className="bg-[#2a2a2c] p-1.5 rounded-lg">
          <Icons.Player className="w-9 h-9 text-zinc-400" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-zinc-200">{playerName}</h2>
          <CapturedPiecesDisplay
                pieces={capturedPieces}
                advantage={materialAdvantage > 0 ? materialAdvantage : 0}
            />
        </div>
      </div>
      {timeInSeconds !== null && <div className="relative -top-1"><Timer timeInSeconds={timeInSeconds} isActive={isTurn} /></div>}
    </div>
  );
};