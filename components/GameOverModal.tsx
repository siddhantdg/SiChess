import React from 'react';
import { Icons } from './Icons';
import { Move } from 'chess.js';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'w' | 'b' | 'draw';
  reason: string;
  onRetry: () => void;
  onAnalyze: () => void;
  onClose: () => void;
  onExit: () => void;
  player1Name: string;
  player2Name: string;
  playerColor?: 'w' | 'b';
  gameMode?: 'pvc' | 'pvp' | 'cvc';
  history: Move[];
  timeControl: 'none' | '10min' | 'custom';
  customTimes: { p1: number, p2: number };
  initialFen: string;
  isChess960: boolean;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, winner, reason, onRetry, onAnalyze, onClose, onExit, player1Name, player2Name, playerColor, gameMode, history, timeControl, customTimes, initialFen, isChess960 }) => {
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
    reason === 'result' ? 'By Game Result' :
    'By Agreement/Repetition';
  
  const handleShare = async () => {
    const result = winner === 'w' ? '1-0' : winner === 'b' ? '0-1' : '1/2-1/2';
    
    const STANDARD_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const isNonStandardStart = initialFen !== STANDARD_FEN;
    const isHandicapGame = gameMode === 'pvc' && isNonStandardStart && !isChess960;

    let eventType: string;
    if (isHandicapGame) {
      eventType = "Vs. Computer (Handicap)";
    } else if (gameMode === 'pvc') {
      eventType = "Vs. Computer";
    } else if (gameMode === 'pvp') {
      eventType = "Local PvP";
    } else if (gameMode === 'cvc') {
      eventType = "Engine Battle";
    } else {
      eventType = "Casual Game";
    }

    let tcString = '-';
    if (timeControl === '10min') {
        tcString = '600';
    } else if (timeControl === 'custom') {
        const whiteStartTime = (gameMode === 'pvc' && playerColor === 'b') ? customTimes.p2 : customTimes.p1;
        tcString = `${whiteStartTime * 60}`;
    }

    const termination = reason.charAt(0).toUpperCase() + reason.slice(1);

    const moveHistory = history.reduce((acc, move, index) => {
        if (index % 2 === 0) {
            return `${acc} ${Math.floor(index / 2) + 1}. ${move.san}`;
        }
        return `${acc} ${move.san}`;
    }, "").trim();

    const pgnHeaders = [];


    pgnHeaders.push(`[Event "${eventType}"]`);

    if (isChess960) {
      pgnHeaders.push(`[Variant "Chess960"]`);
    }

    pgnHeaders.push(`[Site "SiChess"]`);
    pgnHeaders.push(`[Date "${new Date().toISOString().split('T')[0].replace(/-/g, '.')}"]`);
    pgnHeaders.push(`[Round "-"]`);
    pgnHeaders.push(`[White "${whitePlayerName}"]`);
    pgnHeaders.push(`[Black "${blackPlayerName}"]`);
    pgnHeaders.push(`[Result "${result}"]`);
    
    if (isHandicapGame || isChess960) {
      pgnHeaders.push(`[SetUp "1"]`);
      pgnHeaders.push(`[FEN "${initialFen}"]`);
    }
    
    pgnHeaders.push(`[TimeControl "${tcString}"]`);
    pgnHeaders.push(`[Termination "${termination}"]`);

    const pgnText = `${pgnHeaders.join('\n')}\n\n${moveHistory} ${result}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Chess Game Result',
                text: pgnText,
            });
        } catch (error) {
            console.error('Error sharing the game:', error);
        }
    } else {
        alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ease-in-out" aria-hidden="true" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-[#18181a] rounded-3xl shadow-xl w-full max-w-sm p-8 text-center border border-zinc-700 animate-scale-in">
          <button
            onClick={onClose}
            aria-label="Close popup"
            className="absolute top-4 left-4 p-1 text-zinc-500 hover:text-white transition-colors duration-200 rounded-full hover:bg-zinc-700/50"
          >
            <Icons.X className="w-7 h-7" />
          </button>

          <button
            onClick={handleShare}
            aria-label="Share game result"
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors duration-200 rounded-full hover:bg-zinc-700/50"
          >
            <Icons.Share className="w-6 h-6" />
          </button>
          
          <div className="flex justify-center items-center text-yellow-400 mb-4">
            {winner !== 'draw' && <Icons.Crown className="w-16 h-16" />}
          </div>
          <h2 className="text-4xl font-black text-white mb-1">{winnerText}</h2>
          <p className="text-zinc-400 mb-8">{reasonText}</p>

          <div className="space-y-3">
             <button
              onClick={onAnalyze}
              className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200"
            >
              Analyze
            </button>
            <div className="flex space-x-3">
               <button
                onClick={onRetry}
                className="w-full bg-[#2a2a2c] text-zinc-200 font-semibold py-3 rounded-xl hover:bg-[#3a3a3c] transition-colors duration-200"
              >
                Rematch
              </button>
              <button
                onClick={onExit}
                className="w-full bg-[#2a2a2c] text-zinc-200 font-semibold py-3 rounded-xl hover:bg-[#3a3a3c] transition-colors duration-200"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};