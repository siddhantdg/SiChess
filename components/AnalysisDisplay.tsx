import React from 'react';
import { Move } from 'chess.js';

interface AnalysisDisplayProps {
    move: Move | undefined;
    moveIndex: number;
    analysisMode?: boolean;
    bestMoveSan?: string | null;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ move, moveIndex, analysisMode, bestMoveSan }) => {
    // If there is no move, or we are at the start, render a placeholder unless in analysis mode.
    if (!analysisMode && (!move || moveIndex === 0)) {
        return <div className="h-10"></div>;
    }

    const moveNumber = Math.floor((moveIndex + 1) / 2);
    const turn = move?.color === 'w' ? '' : '...';
    const moveNotation = move ? `${moveNumber}${turn} ${move.san}` : 'Start';

    return (
        <div className="flex justify-between items-center text-sm p-2 h-10">
            <div className="flex items-center space-x-2">
                <span className="font-semibold text-zinc-200">{moveNotation}</span>
            </div>
             {analysisMode && bestMoveSan && (
                <div className="flex items-center space-x-1">
                    <span className="text-xs text-zinc-400">Best:</span>
                    <span className="font-semibold text-green-400">{bestMoveSan}</span>
                </div>
            )}
        </div>
    );
};