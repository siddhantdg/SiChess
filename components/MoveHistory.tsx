
import React, { useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { Move } from 'chess.js';
import { MoveAnalysis, MoveClassification } from '../types';

interface MoveHistoryProps {
  history: Move[];
  currentMoveIndex: number; // 0 for start, 1 for first move, etc.
  onNavigate: (index: number) => void;
  analysisResults?: (MoveAnalysis | null)[] | null;
}

const classificationIconMap: Record<MoveClassification, React.ReactNode> = {
    brilliant: <Icons.Analysis.Brilliant className="w-4 h-4 inline-block ml-1" />,
    best: <Icons.Analysis.Best className="w-4 h-4 inline-block ml-1" />,
    excellent: <Icons.Analysis.Excellent className="w-4 h-4 inline-block ml-1" />,
    good: <Icons.Analysis.Good className="w-4 h-4 inline-block ml-1" />,
    book: <Icons.Analysis.Book className="w-4 h-4 inline-block ml-1" />,
    inaccuracy: <Icons.Analysis.Inaccuracy className="w-4 h-4 inline-block ml-1" />,
    mistake: <Icons.Analysis.Mistake className="w-4 h-4 inline-block ml-1" />,
    miss: <Icons.Analysis.Miss className="w-4 h-4 inline-block ml-1" />,
    blunder: <Icons.Analysis.Blunder className="w-4 h-4 inline-block ml-1" />,
};

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, currentMoveIndex, onNavigate, analysisResults }) => {
  const currentMoveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Scroll the current move into view
    currentMoveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentMoveIndex]);

  const renderMoves = () => {
    const movePairs: { white: Move; black?: Move }[] = [];
    for (let i = 0; i < history.length; i += 2) {
      movePairs.push({
        white: history[i],
        black: history[i + 1],
      });
    }

    return movePairs.map((pair, index) => {
      const whiteMoveIndex = index * 2 + 1;
      const blackMoveIndex = index * 2 + 2;
      const isWhiteCurrent = currentMoveIndex === whiteMoveIndex;
      const isBlackCurrent = currentMoveIndex === blackMoveIndex;
      
      const whiteAnalysis = analysisResults?.[whiteMoveIndex];
      const blackAnalysis = analysisResults?.[blackMoveIndex];

      return (
        <div key={index} className="flex items-center space-x-2 shrink-0 lg:w-full lg:px-2 lg:py-1 lg:rounded-md lg:even:bg-zinc-800/50">
          <span className="text-zinc-500 font-medium w-8 text-center">{index + 1}.</span>
          <div className="flex-grow grid grid-cols-2 gap-2">
            <button
              ref={isWhiteCurrent ? currentMoveRef : null}
              onClick={() => onNavigate(whiteMoveIndex)}
              className={`px-2 py-1 rounded-lg w-full text-center flex items-center justify-center ${
                isWhiteCurrent
                  ? 'bg-sky-800/50 text-sky-300'
                  : 'text-zinc-300'
              }`}
            >
              {pair.white.san}
              {whiteAnalysis && classificationIconMap[whiteAnalysis.classification]}
            </button>
            {pair.black ? (
              <button
                ref={isBlackCurrent ? currentMoveRef : null}
                onClick={() => onNavigate(blackMoveIndex)}
                className={`px-2 py-1 rounded-lg w-full text-center flex items-center justify-center ${
                  isBlackCurrent
                    ? 'bg-sky-800/50 text-sky-300'
                    : 'text-zinc-300'
                }`}
              >
                {pair.black.san}
                {blackAnalysis && classificationIconMap[blackAnalysis.classification]}
              </button>
            ) : <div />}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex items-center justify-between bg-[#18181a] py-1 px-1 lg:bg-transparent lg:p-0 lg:h-full lg:flex-col lg:items-stretch">
      <button onClick={() => onNavigate(currentMoveIndex - 1)} disabled={currentMoveIndex <= 0} className="disabled:opacity-20 p-1 lg:hidden">
        <Icons.ChevronLeft className="w-7 h-7" />
      </button>

      <div className="flex-grow flex items-center space-x-3 overflow-x-auto scrollbar-hide text-base px-2 font-medium lg:flex-col lg:items-stretch lg:space-x-0 lg:space-y-1 lg:overflow-y-auto lg:p-2">
        {/* Header for LG screens */}
        <div className="hidden lg:flex sticky top-0 bg-[#18181a] z-10 items-center space-x-2 shrink-0 w-full px-2 pb-2 mb-1 border-b border-zinc-700">
            <span className="text-zinc-500 font-bold w-8 text-center">#</span>
            <div className="flex-grow grid grid-cols-2 gap-2">
                <span className="font-semibold text-zinc-300 text-center">White</span>
                <span className="font-semibold text-zinc-300 text-center">Black</span>
            </div>
        </div>
        
        {/* Moves Content */}
        <div className="shrink-0 lg:w-full">
          <button
              ref={currentMoveIndex === 0 ? currentMoveRef : null}
              onClick={() => onNavigate(0)}
              className={`px-2 py-1 rounded-lg shrink-0 lg:w-full ${
                  currentMoveIndex === 0
                  ? 'bg-sky-800/50 text-sky-300'
                  : 'text-zinc-300'
              }`}
          >
              Start
          </button>
        </div>
        {renderMoves()}
      </div>

      <button onClick={() => onNavigate(currentMoveIndex + 1)} disabled={currentMoveIndex >= history.length} className="disabled:opacity-20 p-1 lg:hidden">
        <Icons.ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
};
