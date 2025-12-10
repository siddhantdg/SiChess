
import React from 'react';
import { Icons } from './Icons';
import { GameAnalysis, MoveClassification, Difficulty, MoveAnalysis } from '../types';
import { GameFlowChart } from './GameFlowChart';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  summary: GameAnalysis['summary'];
  analysisDetails: (MoveAnalysis | null)[];
  playerNames: { player1: string, player2: string };
  winner?: 'w' | 'b' | 'draw';
  gameMode: 'pvc' | 'pvp' | 'cvc';
  difficulty: Difficulty;
  playerColor: 'w' | 'b';
}

const classificationOrder: MoveClassification[] = ['brilliant', 'great', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'miss', 'blunder'];

const classificationLabels: Record<MoveClassification, string> = {
    brilliant: 'Brilliant',
    great: 'Great',
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
    brilliant: <Icons.Analysis.Brilliant className="w-6 h-6" />,
    great: <Icons.Analysis.Great className="w-6 h-6" />,
    best: <Icons.Analysis.Best className="w-6 h-6" />,
    excellent: <Icons.Analysis.Excellent className="w-6 h-6" />,
    good: <Icons.Analysis.Good className="w-6 h-6" />,
    book: <Icons.Analysis.Book className="w-6 h-6" />,
    inaccuracy: <Icons.Analysis.Inaccuracy className="w-6 h-6" />,
    mistake: <Icons.Analysis.Mistake className="w-6 h-6" />,
    miss: <Icons.Analysis.Miss className="w-6 h-6" />,
    blunder: <Icons.Analysis.Blunder className="w-6 h-6" />
};

const moveCountColor: Record<MoveClassification, string> = {
    brilliant: 'text-cyan-400',
    great: 'text-blue-500',
    best: 'text-lime-400',
    excellent: 'text-green-500',
    good: 'text-green-400',
    book: 'text-amber-500',
    inaccuracy: 'text-yellow-400',
    mistake: 'text-orange-500',
    miss: 'text-red-500',
    blunder: 'text-red-600',
};

export const GameReviewModal: React.FC<GameReviewModalProps> = ({ isOpen, onClose, onContinue, summary, analysisDetails, playerNames, winner, gameMode, difficulty, playerColor }) => {
    if (!isOpen) return null;

    let whitePlayerName: string;
    let blackPlayerName: string;
    let whiteIsHuman: boolean;
    let blackIsHuman: boolean;

    if (gameMode === 'pvc') {
        if (playerColor === 'w') {
            whitePlayerName = playerNames.player1; // human
            blackPlayerName = playerNames.player2; // computer
            whiteIsHuman = true;
            blackIsHuman = false;
        } else { // player is black
            whitePlayerName = playerNames.player2; // computer
            blackPlayerName = playerNames.player1; // human
            whiteIsHuman = false;
            blackIsHuman = true;
        }
    } else { // pvp or cvc
        whitePlayerName = playerNames.player1;
        blackPlayerName = playerNames.player2;
        whiteIsHuman = gameMode !== 'cvc';
        blackIsHuman = gameMode !== 'cvc';
    }

    const whiteSummary = summary.white;
    const blackSummary = summary.black;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#18181a] text-zinc-200 animate-scale-in">
            {/* Header */}
            <header className="flex items-center p-4 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                    <Icons.ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold mx-auto">Game Review</h1>
                <div className="w-9"></div> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 overflow-y-auto">
                <div className="max-w-md mx-auto">
                    <div className="bg-[#202022] p-4 rounded-2xl border border-[#2d2d2f]">
                        <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 items-center" style={{ rowGap: '0.75rem' }}>
                            <div className="col-start-2 text-center font-bold text-white text-xl">{whitePlayerName}</div>
                            <div className="col-start-3 text-center font-bold text-white text-xl">{blackPlayerName}</div>

                            <div className="text-zinc-400 font-semibold text-lg">Players</div>
                            <div className="flex justify-center">
                                <div
                                    className={`w-14 h-14 rounded-xl p-1 transition-all duration-300`}
                                    style={winner === 'w' ? { backgroundImage: 'linear-gradient(to bottom right, #AEEA00, #8BC34A)' } : {}}
                                >
                                    <div className="bg-[#2a2a2c] w-full h-full rounded-lg flex items-center justify-center">
                                        {whiteIsHuman 
                                            ? <Icons.Player className="w-10 h-10 text-zinc-400" />
                                            : <Icons.Computer className="w-10 h-10 text-zinc-400" />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div
                                    className={`w-14 h-14 rounded-xl p-1 transition-all duration-300`}
                                    style={winner === 'b' ? { backgroundImage: 'linear-gradient(to bottom right, #AEEA00, #8BC34A)' } : {}}
                                >
                                    <div className="bg-[#2a2a2c] w-full h-full rounded-lg flex items-center justify-center">
                                        {blackIsHuman
                                            ? <Icons.Player className="w-10 h-10 text-zinc-400" />
                                            : <Icons.Computer className="w-10 h-10 text-zinc-400" />
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="text-zinc-400 font-semibold text-lg">Accuracy</div>
                            <div className="flex justify-center">
                                <div className={`w-20 text-center font-bold text-xl py-1.5 rounded-lg ${winner === 'w' ? 'bg-zinc-200 text-zinc-900' : 'bg-[#2a2a2c] text-zinc-200'}`}>
                                    {whiteSummary.accuracy}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className={`w-20 text-center font-bold text-xl py-1.5 rounded-lg ${winner === 'b' ? 'bg-zinc-200 text-zinc-900' : 'bg-[#2a2a2c] text-zinc-200'}`}>
                                    {blackSummary.accuracy}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Report Title/Separator */}
                    <div className="flex items-center text-center my-8">
                        <div className="flex-grow border-t border-zinc-700/80"></div>
                        <span className="flex-shrink mx-4 text-sm font-bold tracking-wider text-zinc-500 uppercase">Performance Report</span>
                        <div className="flex-grow border-t border-zinc-700/80"></div>
                    </div>

                    {/* Move Breakdown Rows */}
                    <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 items-center" style={{ rowGap: '0.75rem' }}>
                        {classificationOrder.map((key) => (
                            <React.Fragment key={key}>
                                <div className="text-zinc-300 font-medium text-lg">{classificationLabels[key]}</div>
                                <div className={`text-center font-bold text-xl ${moveCountColor[key]}`}>
                                    {whiteSummary.moveCounts[key]}
                                </div>
                                <div className="flex justify-center">{classificationIcons[key]}</div>
                                <div className={`text-center font-bold text-xl ${moveCountColor[key]}`}>
                                    {blackSummary.moveCounts[key]}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Game Flow Title/Separator */}
                    <div className="flex items-center text-center my-8">
                        <div className="flex-grow border-t border-zinc-700/80"></div>
                        <span className="flex-shrink mx-4 text-sm font-bold tracking-wider text-zinc-500 uppercase">Game Flow</span>
                        <div className="flex-grow border-t border-zinc-700/80"></div>
                    </div>

                    <GameFlowChart analysisDetails={analysisDetails} />
                </div>
            </main>

            {/* Footer Button */}
            <footer className="p-4 shrink-0">
                <div className="max-w-md mx-auto">
                    <button 
                        onClick={onContinue}
                        className="w-full bg-sky-600 text-white font-bold text-base py-2.5 rounded-xl hover:bg-sky-500 active:bg-sky-700 transition-colors duration-200"
                    >
                        Continue Review
                    </button>
                </div>
            </footer>
        </div>
    );
};
