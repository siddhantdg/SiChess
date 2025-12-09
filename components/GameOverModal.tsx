
import React from 'react';
import { Icons } from './Icons';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'w' | 'b' | 'draw';
  reason: string;
  onRetry: () => void;
  onAnalyse: () => void;
  onClose: () => void;
  player1Name: string;
  player2Name: string;
  playerColor?: 'w' | 'b';
  gameMode?: 'pvc' | 'pvp';
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, winner, reason, onRetry, onAnalyse, onClose, player1Name, player2Name, playerColor, gameMode }) => {
  if (!isOpen) return null;

  let whitePlayerName = player1Name;
  let blackPlayerName = player2Name;

  // In PVC, if the human player chose black, their name (player1Name) should be associated with black.
  if (gameMode === 'pvc' && playerColor === 'b') {
    whitePlayerName = player2Name; // Computer is white
    blackPlayerName = player1Name; // Player is black
  }

  const winnerText = 
    winner === 'w' ? `${whitePlayerName} Wins!` : 
    winner === 'b' ? `${blackPlayerName} Wins!` : 
    'Draw!';
    
  const reasonText = 
    reason === 'checkmate' ? 'By Checkmate' : 
    reason === 'stalemate' ? 'By Stalemate' : 
    reason === 'timeout' ? 'On Time' :
    reason === 'resignation' ? 'By Resignation' :
    'By Agreement/Repetition';

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ease-in-out" aria-hidden="true" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#18181a] rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-zinc-700 animate-scale-in">
          <div className="flex justify-center items-center text-yellow-400 mb-4">
            {winner !== 'draw' && <Icons.Crown className="w-16 h-16" />}
          </div>
          <h2 className="text-4xl font-black text-white mb-1">{winnerText}</h2>
          <p className="text-zinc-400 mb-8">{reasonText}</p>

          <div className="space-y-3">
             <button
              onClick={onAnalyse}
              className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200"
            >
              Analyse
            </button>
            <div className="flex space-x-3">
               <button
                onClick={onRetry}
                className="w-full bg-[#2a2a2c] text-zinc-200 font-semibold py-3 rounded-xl hover:bg-[#3a3a3c] transition-colors duration-200"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="w-full bg-[#2a2a2c] text-zinc-200 font-semibold py-3 rounded-xl hover:bg-[#3a3a3c] transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
