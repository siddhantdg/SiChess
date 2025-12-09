
import React from 'react';
import { Icons } from './Icons';
import { GameAnalysis, MoveClassification, Difficulty } from '../types';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  summary: GameAnalysis['summary'];
  playerNames: { player1: string, player2: string };
  winner?: 'w' | 'b' | 'draw';
  gameMode: 'pvc' | 'pvp';
  difficulty: Difficulty;
}

const classificationOrder: MoveClassification[] = ['brilliant', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'miss', 'blunder'];

const classificationLabels: Record<MoveClassification, string> = {
    brilliant: 'Great',
    best: 'Best',
    excellent: 'Excellent',
    good: 'Good',
    book: 'Book',
    inaccuracy: 'Inaccuracy',
    mistake: 'Mistake',
    miss: 'Miss',
    blunder: 'Blunder'
};

const classificationIcons: Record<MoveClassification, React.ReactNode> = {
    brilliant: <Icons.Analysis.Brilliant className="w-7 h-7" />,
    best: <Icons.Analysis.Best className="w-7 h-7" />,
    excellent: <Icons.Analysis.Excellent className="w-7 h-7" />,
    good: <Icons.Analysis.Good className="w-7 h-7" />,
    book: <Icons.Analysis.Book className="w-7 h-7" />,
    inaccuracy: <Icons.Analysis.Inaccuracy className="w-7 h-7" />,
    mistake: <Icons.Analysis.Mistake className="w-7 h-7" />,
    miss: <Icons.Analysis.Miss className="w-7 h-7" />,
    blunder: <Icons.Analysis.Blunder className="w-7 h-7" />
};

const moveCountColor: Record<MoveClassification, string> = {
    brilliant: 'text-sky-400',
    best: 'text-lime-400',
    excellent: 'text-green-500',
    good: 'text-green-400',
    book: 'text-amber-500',
    inaccuracy: 'text-yellow-400',
    mistake: 'text-orange-500',
    miss: 'text-red-500',
    blunder: 'text-red-600',
};

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

export const GameReviewModal: React.FC<GameReviewModalProps> = ({ isOpen, onClose, onContinue, summary, playerNames, winner, gameMode, difficulty }) => {
    if (!isOpen) return null;

    const whitePlayerName = playerNames.player1;
    const blackPlayerName = playerNames.player2;

    const whiteSummary = summary.white;
    const blackSummary = summary.black;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#18181a] text-white animate-scale-in">
            {/* Header */}
            <header className="flex items-center p-4 shrink-0 border-b border-zinc-700">
                <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                    <Icons.ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold mx-auto">Game Review</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 overflow-y-auto">
                <div className="max-w-md mx-auto">
                    {/* Player & Accuracy Section */}
                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 items-center">
                            <div className="text-zinc-400 font-semibold text-lg">Players</div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`p-1 rounded-lg border-2 ${winner === 'w' ? 'border-green-500' : 'border-transparent'}`}>
                                    <div className="bg-[#3a3a3c] p-1.5 rounded-md">
                                        <Icons.Player className="w-10 h-10" />
                                    </div>
                                </div>
                                <span className="font-semibold truncate max-w-[100px]">{whitePlayerName}</span>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`p-1 rounded-lg border-2 ${winner === 'b' ? 'border-green-500' : 'border-transparent'}`}>
                                    <div className="bg-[#3a3a3c] p-1.5 rounded-md">
                                        {gameMode === 'pvc' ? <DifficultyIcon difficulty={difficulty} className="w-10 h-10" /> : <Icons.Player className="w-10 h-10" />}
                                    </div>
                                </div>
                                <span className="font-semibold truncate max-w-[100px]">{blackPlayerName}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_2fr_2fr] gap-4 items-center">
                            <div className="text-zinc-400 font-semibold text-lg">Accuracy</div>
                             <div className={`text-center font-bold text-3xl py-2 rounded-lg transition-colors ${winner === 'w' ? 'bg-white text-black' : 'bg-[#3a3a3c]'}`}>
                                {whiteSummary.accuracy}
                            </div>
                            <div className={`text-center font-bold text-3xl py-2 rounded-lg transition-colors ${winner === 'b' ? 'bg-white text-black' : 'bg-[#3a3a3c]'}`}>
                                {blackSummary.accuracy}
                            </div>
                        </div>
                    </div>

                    <hr className="border-zinc-700/50 my-8" />

                    {/* Move Breakdown Section */}
                    <div className="space-y-3">
                        {classificationOrder.map((key) => (
                            <div key={key} className="grid grid-cols-[2fr_1fr_auto_1fr] gap-x-4 items-center">
                                <div className="text-zinc-300 font-medium text-lg">{classificationLabels[key]}</div>
                                <div className={`text-right font-semibold text-xl ${moveCountColor[key]}`}>
                                    {whiteSummary.moveCounts[key]}
                                </div>
                                <div className="flex justify-center">{classificationIcons[key]}</div>
                                <div className={`text-left font-semibold text-xl ${moveCountColor[key]}`}>
                                    {blackSummary.moveCounts[key]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer Button */}
            <footer className="p-4 shrink-0 border-t border-zinc-700">
                <div className="max-w-md mx-auto">
                    <button 
                        onClick={onContinue}
                        className="w-full bg-sky-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-sky-500 active:bg-sky-700 transition-colors duration-200"
                    >
                        Continue Review
                    </button>
                </div>
            </footer>
        </div>
    );
};
