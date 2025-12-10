
import { Chess, Move } from 'chess.js';
import { GameAnalysis, MoveAnalysis, MoveClassification } from '../types';
import { findBestMoveForAnalysis, getEvaluation } from './chessEngine';

const initialMoveCounts: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    miss: 0,
    blunder: 0,
};

const PIECE_VALUES: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

// Sigmoid function to convert centipawns to winning chances [-1, 1] for White
const getWinningChance = (centipawns: number): number => {
    return 2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1;
};

const classifyMove = (centipawnLoss: number, move: Move, nextMove?: Move, bestEval?: number, playerColor?: 'w' | 'b'): MoveClassification => {
    // Check for Missed Win (Miss)
    // If the best evaluation was significantly winning (e.g. > +2.5 for white or < -2.5 for black)
    // and the move caused a large drop to equality or worse.
    // Note: bestEval is in pawns.
    
    if (bestEval !== undefined && playerColor) {
        const isWinning = playerColor === 'w' ? bestEval > 2.5 : bestEval < -2.5;
        const currentEval = playerColor === 'w' ? bestEval - (centipawnLoss / 100) : bestEval + (centipawnLoss / 100);
        const isNowNotWinning = playerColor === 'w' ? currentEval < 0.8 : currentEval > -0.8;
        
        if (isWinning && isNowNotWinning) {
            return 'miss';
        }
    }

    // Blunder: Large error
    if (centipawnLoss >= 200) return 'blunder';
    
    // Mistake: Significant error
    if (centipawnLoss >= 100) return 'mistake';
    
    // Inaccuracy: Noticeable sub-optimal play
    if (centipawnLoss >= 50) return 'inaccuracy';
    
    // Good: Decent move
    if (centipawnLoss >= 20) return 'good';
    
    // Excellent: Very close to best
    if (centipawnLoss > 0) return 'excellent';
    
    // --- Best Category (loss approx 0) ---
    
    // 1. Underpromotion -> Great
    if (move.flags.includes('p') && move.promotion !== 'q') {
        return 'great';
    }

    // 2. Sacrifice Detection
    if (nextMove && nextMove.to === move.to && nextMove.captured) {
        const myPieceValue = PIECE_VALUES[move.piece] || 0;
        const capturedValue = move.captured ? (PIECE_VALUES[move.captured] || 0) : 0;
        
        // Net material change for us immediately after the exchange
        // e.g. We capture Pawn (1), they capture our Knight (3). Diff = 1 - 3 = -2.
        const materialDiff = capturedValue - myPieceValue;

        // Brilliant: Sacrificing significant material (Minor piece or more, val >= 3)
        if (materialDiff <= -3) {
             return 'brilliant';
        }
        
        // Great: Sacrificing some material (e.g. exchange sac or pawn)
        if (materialDiff < 0) {
             return 'great';
        }
    }

    return 'best';
};

export const analyzeGame = async (
    history: Move[],
    startFen: string,
    onProgress: (progress: number) => void
): Promise<GameAnalysis> => {
    const detailedResults: (MoveAnalysis | null)[] = [null]; // Start with null for initial board position
    const game = new Chess(startFen);

    const summary: GameAnalysis['summary'] = {
        white: { accuracy: 0, moveCounts: { ...initialMoveCounts } },
        black: { accuracy: 0, moveCounts: { ...initialMoveCounts } },
    };

    let whiteAccuracySum = 0;
    let blackAccuracySum = 0;
    let whiteMoveCount = 0;
    let blackMoveCount = 0;

    const ANALYSIS_DEPTH = 18; 

    for (let i = 0; i < history.length; i++) {
        const move = history[i];
        const nextMove = i + 1 < history.length ? history[i + 1] : undefined;
        const playerColor = move.color;
        
        let classification: MoveClassification;
        let bestMoveForPos: { from: string, to: string, score: number } | null = null;
        let evalAfterMove = 0;
        let moveAccuracy = 0;

        if (i < 2) { // First 2 moves are Book
            classification = 'book';
            game.move(move);
            evalAfterMove = await getEvaluation(game.fen(), 10);
            moveAccuracy = 100;
        } else {
            // 1. Get Best Move and Score for current position (Before making the move)
            bestMoveForPos = await findBestMoveForAnalysis(game, ANALYSIS_DEPTH);
            
            // Check if the player's move matches the best move found
            const isBestMove = bestMoveForPos && 
                               bestMoveForPos.from === move.from && 
                               bestMoveForPos.to === move.to;

            // 2. Make the actual move
            game.move(move);
            
            // 3. Get evaluation of the position resulting from the move
            if (isBestMove && bestMoveForPos) {
                evalAfterMove = bestMoveForPos.score;
            } else {
                evalAfterMove = await getEvaluation(game.fen(), ANALYSIS_DEPTH);
            }
            
            // --- Accuracy Calculation ---
            const bestEval = bestMoveForPos ? bestMoveForPos.score : evalAfterMove;
            const actualEval = evalAfterMove;

            const winChanceBest = getWinningChance(bestEval * 100);
            const winChanceActual = getWinningChance(actualEval * 100);

            if (playerColor === 'w') {
                const probBest = (winChanceBest + 1) / 2;
                const probActual = (winChanceActual + 1) / 2;
                const diff = Math.max(0, probBest - probActual);
                moveAccuracy = 100 * (1 - diff);
            } else {
                const probBest = (1 - winChanceBest) / 2;
                const probActual = (1 - winChanceActual) / 2;
                const diff = Math.max(0, probBest - probActual);
                moveAccuracy = 100 * (1 - diff);
            }

            let loss = 0;
            if (bestMoveForPos) {
                if (playerColor === 'w') {
                    loss = bestMoveForPos.score - evalAfterMove;
                } else {
                    loss = evalAfterMove - bestMoveForPos.score;
                }
            }
            if (loss < 0) loss = 0;
            const centipawnLoss = Math.round(loss * 100);
            
            classification = classifyMove(centipawnLoss, move, nextMove, bestMoveForPos?.score, playerColor);
        }
        
        if (playerColor === 'w') {
            whiteAccuracySum += moveAccuracy;
            whiteMoveCount++;
        } else {
            blackAccuracySum += moveAccuracy;
            blackMoveCount++;
        }

        summary[playerColor === 'w' ? 'white' : 'black'].moveCounts[classification]++;

        detailedResults.push({
            classification,
            bestMove: bestMoveForPos ? { 
                from: bestMoveForPos.from as any, 
                to: bestMoveForPos.to as any, 
                san: '' 
            } : null,
            evalBefore: bestMoveForPos ? bestMoveForPos.score : evalAfterMove,
            evalAfter: evalAfterMove,
        });
        
        // Generate SAN for best move if needed
        if (detailedResults[detailedResults.length - 1]?.bestMove && bestMoveForPos) {
             game.undo(); 
             try {
                 const m = game.move({ 
                     from: bestMoveForPos.from, 
                     to: bestMoveForPos.to, 
                     promotion: 'q' 
                 });
                 if (detailedResults[detailedResults.length - 1]!.bestMove) {
                     detailedResults[detailedResults.length - 1]!.bestMove!.san = m.san;
                 }
                 game.undo(); 
             } catch(e) { /* ignore */ }
             game.move(move); 
        }

        onProgress( ((i + 1) / history.length) * 100 );
    }
    
    summary.white.accuracy = whiteMoveCount > 0 ? parseFloat((whiteAccuracySum / whiteMoveCount).toFixed(1)) : 0;
    summary.black.accuracy = blackMoveCount > 0 ? parseFloat((blackAccuracySum / blackMoveCount).toFixed(1)) : 0;
    
    return {
        summary,
        details: detailedResults,
    };
};
