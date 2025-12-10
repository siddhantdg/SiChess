
import { Chess } from 'chess.js';
import { Difficulty, getEngineConfig, EngineConfig, PlayStyle } from '../types';

type EngineTask = {
    type: 'move' | 'eval' | 'analysis';
    fen: string;
    params: any;
    resolve: (result: any) => void;
};

class StockfishEngine {
    private worker: Worker;
    private isReady: boolean = false;
    private readyPromise: Promise<void>;
    private queue: EngineTask[] = [];
    private isProcessing: boolean = false;
    private currentTask: EngineTask | null = null;
    private currentScore: number = 0;
    private onReadyCallbacks: (() => void)[] = [];
    private allPVLines: Array<{move: string, score: number}> = []; // Store all PV lines

    constructor() {
        this.worker = new Worker('/stockfish.js');
        let resolveReady: (() => void) | null = null;
        this.readyPromise = new Promise<void>((resolve) => {
            resolveReady = resolve;
        });

        this.worker.onmessage = (event) => {
            const line = event.data;
            
            if (line === 'uciok') {
                this.isReady = true;
                if (resolveReady) resolveReady();
            }

            if (line === 'readyok') {
                const resolve = this.onReadyCallbacks.shift();
                if (resolve) resolve();
            }
            
            this.handleMessage(line);
        };

        this.worker.onerror = (error) => {
            console.error('Stockfish worker error:', error);

            if (this.currentTask) {
                this.resolveTaskSafe(this.currentTask);
                this.currentTask = null;
            }

            while (this.queue.length > 0) {
                const task = this.queue.shift();
                if (task) this.resolveTaskSafe(task);
            }

            while (this.onReadyCallbacks.length > 0) {
                const resolve = this.onReadyCallbacks.shift();
                if (resolve) resolve();
            }

            this.isProcessing = false;
        };

        this.worker.postMessage('uci');
    }

    private resolveTaskSafe(task: EngineTask) {
        if (task.type === 'eval') {
            task.resolve(0);
        } else {
            task.resolve(null);
        }
    }

    private waitForReady(): Promise<void> {
        return new Promise((resolve) => {
            this.onReadyCallbacks.push(resolve);
            this.worker.postMessage('isready');
        });
    }

    private handleMessage(line: string) {
        if (!this.currentTask) return;

        if (line.startsWith('info') && line.includes('multipv')) {
            const pvMatch = line.match(/multipv (\d+)/);
            const moveMatch = line.match(/pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
            const cpMatch = line.match(/score cp (-?\d+)/);
            const mateMatch = line.match(/score mate (-?\d+)/);
            
            if (pvMatch && moveMatch) {
                const pvIndex = parseInt(pvMatch[1], 10);
                const move = moveMatch[1];
                
                let score = 0;
                if (cpMatch) {
                    score = parseInt(cpMatch[1], 10) / 100;
                } else if (mateMatch) {
                    const movesToMate = parseInt(mateMatch[1], 10);
                    score = movesToMate > 0 ? 10000 - movesToMate : -10000 - movesToMate;
                }
                
                // Normalize to White's perspective
                const turn = this.currentTask.fen.split(' ')[1];
                if (turn === 'b') {
                    score = -score;
                }
                
                // Store this PV line
                this.allPVLines[pvIndex - 1] = { move, score };

                // Update currentScore if this is the primary PV line.
                // This ensures we capture the score even if standard info parsing is skipped due to multipv presence.
                if (pvIndex === 1) {
                    this.currentScore = score;
                }
            }
        }

        if (line.startsWith('info') && line.includes('score') && !line.includes('multipv')) {
            const cpMatch = line.match(/score cp (-?\d+)/);
            const mateMatch = line.match(/score mate (-?\d+)/);
            
            let score = 0;
            if (cpMatch) {
                score = parseInt(cpMatch[1], 10) / 100;
            } else if (mateMatch) {
                const movesToMate = parseInt(mateMatch[1], 10);
                score = movesToMate > 0 ? 10000 - movesToMate : -10000 - movesToMate;
            }
            
            const turn = this.currentTask.fen.split(' ')[1];
            if (turn === 'b') {
                score = -score;
            }
            this.currentScore = score;
        }

        if (line.startsWith('bestmove')) {
            const parts = line.split(' ');
            const bestMoveStr = parts[1];
            
            let selectedMove = null;
            let finalScore = this.currentScore;
            
            const config = this.currentTask.params.config as EngineConfig;
            const playStyle = this.currentTask.params.playStyle as PlayStyle;

            // Determine if we should use the MultiPV selection logic
            // 1. If config enables it (Low levels)
            // 2. If style requires it (Aggressive/Defensive), even if config disabled it (High levels)
            // Note: For 'balanced', we only use it if the config explicitly asked for it (Low levels). 
            // If Balanced + High Level, we skip this block and use the engine's bestMove directly.
            const shouldUseMultiPVSelection = (config?.useMultiPV || (playStyle && playStyle !== 'balanced')) && this.allPVLines.length > 0;
            
            if (shouldUseMultiPVSelection) {
                const errorChance = this.currentTask.params.errorChance || 0; // The calculated probability to NOT play best move
                
                const validMoves = this.allPVLines.filter(pv => pv && pv.move);
                
                if (validMoves.length > 0) {
                    let candidateIndices: number[] = [0];
                    let targetCategory = 'good'; 
                    
                    const shouldMakeError = Math.random() < errorChance;

                    if (shouldMakeError && validMoves.length > 1) {
                        const weights = {
                            good: config.goodChance,
                            inaccuracy: config.inaccuracyChance,
                            mistake: config.mistakeChance,
                            miss: config.missChance,
                            blunder: config.blunderChance
                        };
                        
                        const totalWeight = weights.good + weights.inaccuracy + weights.mistake + weights.miss + weights.blunder;
                        const rand = Math.random() * totalWeight;
                        
                        let currentWeight = 0;

                        if (rand < (currentWeight += weights.blunder)) targetCategory = 'blunder';
                        else if (rand < (currentWeight += weights.miss)) targetCategory = 'miss';
                        else if (rand < (currentWeight += weights.mistake)) targetCategory = 'mistake';
                        else if (rand < (currentWeight += weights.inaccuracy)) targetCategory = 'inaccuracy';
                        else targetCategory = 'good';
                    }

                    
                    if (targetCategory === 'good') {
                        if (playStyle && playStyle !== 'balanced') {
                             candidateIndices = [0, 1, 2, 3, 4];
                        } else {
                             candidateIndices = [0, 1];
                        }
                    } else if (targetCategory === 'inaccuracy') {
                        candidateIndices = [2, 3];
                    } else if (targetCategory === 'mistake') {
                        candidateIndices = [3, 4, 5];
                    } else if (targetCategory === 'miss') {
                        candidateIndices = [6, 7, 8];
                    } else if (targetCategory === 'blunder') {
                        candidateIndices = [9, 10, 11, 12, 13, 14, 15];
                    }

                    candidateIndices = candidateIndices.filter(i => i < validMoves.length);
                    
                    if (candidateIndices.length === 0) {
                        if (targetCategory !== 'good') {
                            candidateIndices = [validMoves.length - 1]; // Pick worst available
                        } else {
                            candidateIndices = [0];
                        }
                    }

                    let selectedIndex = candidateIndices[0]; 

                    if (playStyle && playStyle !== 'balanced' && candidateIndices.length > 0) {
                         try {
                            const game = new Chess(this.currentTask.fen);
                            
                            const styledCandidates = candidateIndices.map(index => {
                                const moveData = validMoves[index];
                                const moveSan = game.move({ 
                                    from: moveData.move.substring(0,2), 
                                    to: moveData.move.substring(2,4),
                                    promotion: moveData.move.length === 5 ? moveData.move[4] : undefined
                                });
                                game.undo(); 
                                
                                let score = 0;
                                
                                if (playStyle === 'aggressive') {
                                    if (moveSan.captured) score += 2; // Priority: Capture
                                    if (moveSan.san.includes('+')) score += 3; // Priority: Check
                                    if (moveSan.san.includes('#')) score += 10; // Priority: Mate
                                } else if (playStyle === 'defensive') {
                                    if (moveSan.san.includes('O-O')) score += 5; // Priority: Castle
                                    if (moveSan.san.includes('+')) score -= 2; // Avoid giving checks (often leads to complications)
                                    if (moveSan.captured) score -= 1; // Avoid trades if possible (very simplified defensive)
                                }
                                
                                // Add a tiny bit of the engine score to break ties, ensuring we prefer the "better" move if style points are equal
                                // Engine score is usually e.g. 0.50, 1.20. 
                                score += moveData.score * 0.1;

                                return { index, styleScore: score };
                            });
                            
                            styledCandidates.sort((a, b) => b.styleScore - a.styleScore);
                            selectedIndex = styledCandidates[0].index;

                         } catch (e) {
                             console.warn("Style selection error", e);
                         }
                    } else if (candidateIndices.length > 1) {
                         selectedIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
                    }
                    
                    selectedMove = {
                        from: validMoves[selectedIndex].move.substring(0, 2),
                        to: validMoves[selectedIndex].move.substring(2, 4),
                        promotion: validMoves[selectedIndex].move.length === 5 ? validMoves[selectedIndex].move[4] : undefined
                    };
                    finalScore = validMoves[selectedIndex].score;
                }
            } else {
                selectedMove = (bestMoveStr && bestMoveStr !== '(none)') ? {
                    from: bestMoveStr.substring(0, 2),
                    to: bestMoveStr.substring(2, 4),
                    promotion: bestMoveStr.length === 5 ? bestMoveStr[4] : undefined
                } : null;
            }
            
            const result = {
                bestMove: selectedMove,
                score: finalScore
            };

            const resolve = this.currentTask.resolve;
            const type = this.currentTask.type;

            this.currentTask = null;
            this.isProcessing = false;
            this.allPVLines = []; 

            if (type === 'move') {
                resolve(result.bestMove);
            } else if (type === 'eval') {
                resolve(result.score);
            } else if (type === 'analysis') {
                 resolve({
                     from: result.bestMove?.from,
                     to: result.bestMove?.to,
                     score: result.score
                 });
            }

            this.processQueue();
        }
    }

    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        this.currentTask = this.queue.shift()!;
        this.currentScore = 0;
        this.allPVLines = []; 

        await this.readyPromise;
        await this.waitForReady();
        
        if (!this.currentTask) {
            this.isProcessing = false;
            if (this.queue.length > 0) this.processQueue();
            return;
        }

        const { fen, params, type } = this.currentTask;

        this.worker.postMessage('setoption name UCI_LimitStrength value false');
        this.worker.postMessage('setoption name Skill Level value 20');
        this.worker.postMessage('setoption name MultiPV value 1');

        if (type === 'move') {
            const { difficulty, config, playStyle } = params;
            
            this.worker.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
            
            let multiPVCount = config.multiPVCount;
            let useMultiPV = config.useMultiPV;

            if (playStyle && playStyle !== 'balanced') {
                useMultiPV = true;
                if (multiPVCount < 5) multiPVCount = 5; 
            }

            if (useMultiPV && multiPVCount > 1) {
                this.worker.postMessage(`setoption name MultiPV value ${multiPVCount}`);
            }
            
            if (config.uciLimitStrength && config.uciElo) {
                this.worker.postMessage('setoption name UCI_LimitStrength value true');
                this.worker.postMessage(`setoption name UCI_Elo value ${config.uciElo}`);
            }
            
            this.worker.postMessage(`position fen ${fen}`);
            
            this.worker.postMessage(`go depth ${config.depth}`);
        } else {
            this.worker.postMessage(`position fen ${fen}`);
            const { depth } = params;
            this.worker.postMessage(`go depth ${depth || 10}`);
        }
    }

    public execute(task: EngineTask) {
        this.queue.push(task);
        this.processQueue();
    }
}

// Create two separate engines:
// 1. gameEngine: For Computer Moves, Hints, and Analysis (Sequential, high priority)
// 2. evalEngine: For Evaluation Bar updates and Live Feedback (Background, non-blocking)
const gameEngine = new StockfishEngine();
const evalEngine = new StockfishEngine();

export const findComputerMove = (game: Chess, difficulty: Difficulty, playStyle: PlayStyle = 'balanced') => {
    const config = getEngineConfig(difficulty);
    
    // Determine Game Phase
    const historyCount = game.history().length;
    let phase: 'opening' | 'mid' | 'end' = 'mid';
    
    if (historyCount < 16) { // First 8 moves per side
        phase = 'opening';
    } else {
        // Simple Material Count for Endgame detection
        const board = game.board();
        let materialValue = 0;
        for(const row of board) {
            for(const piece of row) {
                if (piece && piece.type !== 'k' && piece.type !== 'p') {
                    const val = { n:3, b:3, r:5, q:9 }[piece.type] || 0;
                    materialValue += val;
                }
            }
        }
        if (materialValue <= 13) { // e.g. Rook + Knight + Pieces
            phase = 'end';
        }
    }

    let errorChance = config.midError;
    if (phase === 'opening') errorChance = config.openingError;
    if (phase === 'end') errorChance = config.endError;

    return new Promise<{from: string, to: string, promotion?: string} | null>((resolve) => {
        gameEngine.execute({
            type: 'move',
            fen: game.fen(),
            params: { difficulty, config, errorChance, playStyle },
            resolve
        });
    });
};

export const getEvaluation = (fen: string, depth: number = 10) => {
    return new Promise<number>((resolve) => {
        evalEngine.execute({
            type: 'eval',
            fen,
            params: { depth },
            resolve
        });
    });
};

export const findBestMoveForAnalysis = (game: Chess, depth: number = 10) => {
    return new Promise<{from: string, to: string, score: number} | null>((resolve) => {
        gameEngine.execute({
            type: 'analysis',
            fen: game.fen(),
            params: { depth },
            resolve
        });
    });
};

export const findBestMoveForFeedback = (game: Chess, depth: number = 10) => {
    return new Promise<{from: string, to: string, score: number} | null>((resolve) => {
        evalEngine.execute({
            type: 'analysis',
            fen: game.fen(),
            params: { depth },
            resolve
        });
    });
};
