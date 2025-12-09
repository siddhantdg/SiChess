
import { Chess, Move } from 'chess.js';
import { GameAnalysis, MoveAnalysis, MoveClassification, PlayerAnalysisSummary } from '../types';
import { findBestMoveForAnalysis, evaluateBoard } from './chessEngine';

const initialMoveCounts: Record<MoveClassification, number> = {
    brilliant: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    miss: 0,
    blunder: 0,
};

const classifyMove = (centipawnLoss: number): MoveClassification => {
    if (centipawnLoss <= 10) return 'best';
    if (centipawnLoss <= 30) return 'excellent';
    if (centipawnLoss <= 70) return 'good';
    if (centipawnLoss <= 150) return 'inaccuracy';
    if (centipawnLoss <= 300) return 'mistake';
    return 'blunder';
};

// Simplified accuracy formula based on average centipawn loss
const calculateAccuracy = (avgCentipawnLoss: number): number => {
    // This formula is a simplified model to approximate chess.com's accuracy.
    // It maps an average loss of 0 to ~100 accuracy and an average loss of 100 to ~50 accuracy.
    const accuracy = 103 * Math.exp(-0.043 * avgCentipawnLoss);
    return parseFloat(Math.min(99.9, Math.max(10.0, accuracy)).toFixed(1));
};


export const analyzeGame = async (
    history: Move[], 
    onProgress: (progress: number) => void
): Promise<GameAnalysis> => {
    const detailedResults: (MoveAnalysis | null)[] = [null]; // Start with null for initial board position
    const game = new Chess();

    const summary: GameAnalysis['summary'] = {
        white: { accuracy: 0, moveCounts: { ...initialMoveCounts } },
        black: { accuracy: 0, moveCounts: { ...initialMoveCounts } },
    };

    let whiteCentipawnLoss = 0;
    let blackCentipawnLoss = 0;
    let whiteMoveCount = 0;
    let blackMoveCount = 0;

    for (let i = 0; i < history.length; i++) {
        const move = history[i];
        const playerColor = move.color;
        
        const evalBeforeRaw = evaluateBoard(game);
        
        let classification: MoveClassification;
        let bestMoveForPos: Move | null = null;
        
        if (i < 4) { // First 2 moves for each player are "Book"
            classification = 'book';
        } else {
            bestMoveForPos = await findBestMoveForAnalysis(game, 2);

            const gameAfterBest = new Chess(game.fen());
            if (bestMoveForPos) {
                gameAfterBest.move(bestMoveForPos);
            }
            const evalAfterBestRaw = evaluateBoard(gameAfterBest);

            const gameAfterActual = new Chess(game.fen());
            gameAfterActual.move(move);
            const evalAfterActualRaw = evaluateBoard(gameAfterActual);
            
            // Calculate centipawn loss
            let loss = 0;
            if (isFinite(evalAfterBestRaw) && isFinite(evalAfterActualRaw)) {
                 loss = playerColor === 'w' ? evalAfterBestRaw - evalAfterActualRaw : evalAfterActualRaw - evalAfterBestRaw;
            }
            
            const centipawnLoss = Math.max(0, loss);
            classification = classifyMove(centipawnLoss);

            if (playerColor === 'w') {
                whiteCentipawnLoss += centipawnLoss;
                whiteMoveCount++;
            } else {
                blackCentipawnLoss += centipawnLoss;
                blackMoveCount++;
            }
        }
        
        const summaryKey = playerColor === 'w' ? 'white' : 'black';
        summary[summaryKey].moveCounts[classification]++;
        
        game.move(move);
        const evalAfterRaw = evaluateBoard(game);

        detailedResults.push({
            classification,
            bestMove: bestMoveForPos ? { from: bestMoveForPos.from, to: bestMoveForPos.to, san: bestMoveForPos.san } : null,
            evalBefore: evalBeforeRaw / 100,
            evalAfter: evalAfterRaw / 100,
        });
        
        onProgress( ((i + 1) / history.length) * 100 );
        
        await new Promise(res => setTimeout(res, 10));
    }
    
    summary.white.accuracy = whiteMoveCount > 0 ? calculateAccuracy(whiteCentipawnLoss / whiteMoveCount) : 100;
    summary.black.accuracy = blackMoveCount > 0 ? calculateAccuracy(blackCentipawnLoss / blackMoveCount) : 100;
    
    return {
        summary,
        details: detailedResults,
    };
};
