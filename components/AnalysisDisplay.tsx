
import React from 'react';
import { Move } from 'chess.js';
import { Icons } from './Icons';
import { MoveAnalysis, MoveClassification } from '../types';

interface AnalysisDisplayProps {
    move: Move | undefined;
    moveIndex: number;
    analysisMode?: boolean;
    bestMoveSan?: string | null;
    currentMoveAnalysis: MoveAnalysis | null;
}

const classificationText: Record<MoveClassification, string> = {
    brilliant: 'Brilliant',
    great: 'Great',
    best: 'Best Move',
    excellent: 'Excellent',
    good: 'Good',
    book: 'Book',
    inaccuracy: 'Inaccuracy',
    mistake: 'Mistake',
    miss: 'Miss',
    blunder: 'Blunder',
};

const classificationIcon: Record<MoveClassification, React.ReactNode> = {
    brilliant: <Icons.Analysis.Brilliant className="w-5 h-5" />,
    great: <Icons.Analysis.Great className="w-5 h-5" />,
    best: <Icons.Analysis.Best className="w-5 h-5" />,
    excellent: <Icons.Analysis.Excellent className="w-5 h-5" />,
    good: <Icons.Analysis.Good className="w-5 h-5" />,
    book: <Icons.Analysis.Book className="w-5 h-5" />,
    inaccuracy: <Icons.Analysis.Inaccuracy className="w-5 h-5" />,
    mistake: <Icons.Analysis.Mistake className="w-5 h-5" />,
    miss: <Icons.Analysis.Miss className="w-5 h-5" />,
    blunder: <Icons.Analysis.Blunder className="w-5 h-5" />,
};

const classificationColor: Record<MoveClassification, string> = {
    brilliant: 'text-cyan-400',
    great: 'text-blue-500',
    best: 'text-lime-400',
    excellent: 'text-green-500',
    good: 'text-green-400',
    book: 'text-amber-600',
    inaccuracy: 'text-yellow-400',
    mistake: 'text-orange-500',
    miss: 'text-red-500',
    blunder: 'text-red-600',
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ move, moveIndex, analysisMode, bestMoveSan, currentMoveAnalysis }) => {
    if (!analysisMode && !bestMoveSan && (!move || moveIndex === 0)) {
        return <div className="h-10"></div>;
    }

    const moveNumber = move ? Math.floor((moveIndex + 1) / 2) : 0;
    const turn = move?.color === 'w' ? '' : '...';
    
    const actualMove = move;
    const san = actualMove ? `${moveNumber}${turn} ${actualMove.san}` : 'Start';
    
    const analysis = analysisMode ? currentMoveAnalysis : null;
    const showFeedback = analysisMode || bestMoveSan;

    return (
        <div className="flex justify-between items-center text-sm p-2 h-10">
            <div className="flex items-center space-x-2">
                {actualMove && <span className="font-semibold text-zinc-200">{san}</span>}
            </div>
            {showFeedback && (
                <div className="flex items-center space-x-2">
                    {analysisMode && analysis && (
                         <div className={`flex items-center space-x-1 font-semibold ${classificationColor[analysis.classification]}`}>
                            {classificationIcon[analysis.classification]}
                            <span>{classificationText[analysis.classification]}</span>
                        </div>
                    )}
                    {bestMoveSan && (
                        <div className="flex items-center space-x-1">
                            <span className="text-xs text-zinc-400">Best:</span>
                            <span className="font-semibold text-green-400">{bestMoveSan}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
