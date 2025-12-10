
import { Square as ChessJsSquare, Piece as ChessJsPiece, Move, Chess } from 'chess.js';

export type Square = ChessJsSquare;
export type Piece = ChessJsPiece;

export type ControlAction = 'settings' | 'hint' | 'undo' | 'resign' | 'analyze' | 'togglePause';

export type Difficulty = number; // ELO Rating
export type DifficultyCategory = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type PlayStyle = 'balanced' | 'aggressive' | 'defensive';

export const difficultyLevels: {label: string; elo: number}[] = [
    { label: 'Beginner', elo: 250 },
    { label: 'Beginner', elo: 400 },
    { label: 'Beginner', elo: 550 },
    { label: 'Beginner', elo: 700 },
    { label: 'Beginner', elo: 800 },
    { label: 'Beginner', elo: 900 },
    { label: 'Intermediate', elo: 1000 },
    { label: 'Intermediate', elo: 1100 },
    { label: 'Intermediate', elo: 1200 },
    { label: 'Intermediate', elo: 1300 },
    { label: 'Intermediate', elo: 1400 },
    { label: 'Intermediate', elo: 1500 },
    { label: 'Advanced', elo: 1600 },
    { label: 'Advanced', elo: 1700 },
    { label: 'Advanced', elo: 1800 },
    { label: 'Advanced', elo: 1900 },
    { label: 'Expert', elo: 2000 },
    { label: 'Expert', elo: 2100 },
    { label: 'Expert', elo: 2200 },
    { label: 'Expert', elo: 2300 },
    { label: 'Master', elo: 2400 },
    { label: 'Master', elo: 2500 },
    { label: 'Grandmaster', elo: 2600 },
    { label: 'Grandmaster', elo: 2700 },
    { label: 'Super GM', elo: 2900 },
    { label: 'Ultimate', elo: 3200 },
];

export const getDifficultyDetails = (elo: Difficulty): {label: string; elo: number} => {
    return difficultyLevels.find(d => d.elo === elo) || difficultyLevels[8]; // Default to 1200
}

export interface EngineConfig {
    uciLimitStrength: boolean;
    uciElo?: number;
    skillLevel: number;
    depth: number;
    moveTime: number;
    useMultiPV: boolean;
    multiPVCount: number;
    
    // Phase-Specific Probability of NOT playing the Best Move (0.0 - 1.0)
    openingError: number;
    midError: number;
    endError: number;

    // If an error occurs, these are the relative weights for selecting the sub-optimal move type
    goodChance: number;       // Index 1: Almost best
    inaccuracyChance: number; // Index 2: Suboptimal
    mistakeChance: number;    // Index 3-5: Bad
    missChance: number;       // Index 6-8: Very Bad
    blunderChance: number;    // Index 9+: Terrible
}

export const getEngineConfig = (elo: Difficulty): EngineConfig => {
    if (elo <= 250) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 0, depth: 1, moveTime: 100, useMultiPV: true, multiPVCount: 10,
        openingError: 0.85, midError: 0.80, endError: 0.70,
        goodChance: 0, inaccuracyChance: 5, mistakeChance: 25, missChance: 40, blunderChance: 30
    };
    
    if (elo <= 400) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 0, depth: 1, moveTime: 150, useMultiPV: true, multiPVCount: 10,
        openingError: 0.75, midError: 0.65, endError: 0.55,
        goodChance: 0, inaccuracyChance: 10, mistakeChance: 40, missChance: 35, blunderChance: 15
    };
    
    if (elo <= 550) return { 
        uciLimitStrength: true, 
        uciElo: 1350, 
        skillLevel: 1, 
        depth: 1, 
        moveTime: 200, 
        useMultiPV: true, 
        multiPVCount: 10,
        openingError: 0.68, 
        midError: 0.52, 
        endError: 0.39,
        goodChance: 0, 
        inaccuracyChance: 12, 
        mistakeChance: 49, 
        missChance: 27, 
        blunderChance: 7
    };
    
    if (elo <= 700) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 2, depth: 2, moveTime: 250, useMultiPV: true, multiPVCount: 10,
        openingError: 0.62, midError: 0.52, endError: 0.38,
        goodChance: 2, inaccuracyChance: 18, mistakeChance: 46, missChance: 28, blunderChance: 6
    };
    
    if (elo <= 800) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 2, depth: 3, moveTime: 300, useMultiPV: true, multiPVCount: 10,
        openingError: 0.57, midError: 0.52, endError: 0.37,
        goodChance: 4, inaccuracyChance: 24, mistakeChance: 43, missChance: 24, blunderChance: 5
    };
    
    if (elo <= 900) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 3, depth: 4, moveTime: 350, useMultiPV: true, multiPVCount: 10,
        openingError: 0.52, midError: 0.52, endError: 0.36,
        goodChance: 6, inaccuracyChance: 30, mistakeChance: 40, missChance: 20, blunderChance: 4
    };
    
    if (elo <= 1000) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 3, depth: 4, moveTime: 400, useMultiPV: true, multiPVCount: 10,
        openingError: 0.47, midError: 0.52, endError: 0.35,
        goodChance: 8, inaccuracyChance: 35, mistakeChance: 37, missChance: 17, blunderChance: 3
    };
    
    if (elo <= 1100) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 4, depth: 5, moveTime: 450, useMultiPV: true, multiPVCount: 10,
        openingError: 0.42, midError: 0.52, endError: 0.34,
        goodChance: 10, inaccuracyChance: 40, mistakeChance: 34, missChance: 14, blunderChance: 2
    };
    
    if (elo <= 1200) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 4, depth: 5, moveTime: 500, useMultiPV: true, multiPVCount: 10,
        openingError: 0.38, midError: 0.52, endError: 0.33,
        goodChance: 12, inaccuracyChance: 44, mistakeChance: 32, missChance: 11, blunderChance: 1
    };
    
    if (elo <= 1300) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 5, depth: 6, moveTime: 550, useMultiPV: true, multiPVCount: 10,
        openingError: 0.35, midError: 0.52, endError: 0.33,
        goodChance: 14, inaccuracyChance: 47, mistakeChance: 31, missChance: 8, blunderChance: 0
    };
    
    if (elo <= 1400) return { 
        uciLimitStrength: true, uciElo: 1350, skillLevel: 6, depth: 7, moveTime: 550, useMultiPV: true, multiPVCount: 10,
        openingError: 0.32, midError: 0.52, endError: 0.32, 
        goodChance: 15,
        inaccuracyChance: 50,
        mistakeChance: 30,
        missChance: 5,        
        blunderChance: 0      
    };
    
    if (elo <= 1500) return { 
        uciLimitStrength: true, uciElo: 1450, skillLevel: 8, depth: 8, moveTime: 600, useMultiPV: true, multiPVCount: 8,
        openingError: 0.28, midError: 0.45, endError: 0.28,
        goodChance: 30, inaccuracyChance: 50, mistakeChance: 15, missChance: 5, blunderChance: 0
    };
    
    if (elo <= 1600) return { 
        uciLimitStrength: true, uciElo: 1550, skillLevel: 10, depth: 9, moveTime: 650, useMultiPV: true, multiPVCount: 6,
        openingError: 0.24, midError: 0.38, endError: 0.24,
        goodChance: 50, inaccuracyChance: 40, mistakeChance: 10, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 1700) return { 
        uciLimitStrength: true, uciElo: 1650, skillLevel: 12, depth: 10, moveTime: 700, useMultiPV: true, multiPVCount: 5,
        openingError: 0.20, midError: 0.30, endError: 0.20,
        goodChance: 65, inaccuracyChance: 30, mistakeChance: 5, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 1800) return { 
        uciLimitStrength: true, uciElo: 1750, skillLevel: 14, depth: 11, moveTime: 750, useMultiPV: true, multiPVCount: 4,
        openingError: 0.16, midError: 0.22, endError: 0.16,
        goodChance: 80, inaccuracyChance: 18, mistakeChance: 2, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 1900) return { 
        uciLimitStrength: true, uciElo: 1850, skillLevel: 16, depth: 12, moveTime: 800, useMultiPV: true, multiPVCount: 3,
        openingError: 0.12, midError: 0.15, endError: 0.12,
        goodChance: 90, inaccuracyChance: 10, mistakeChance: 0, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 2000) return { 
        uciLimitStrength: true, uciElo: 2000, skillLevel: 20, depth: 13, moveTime: 900, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2100) return {
        uciLimitStrength: true, uciElo: 2100, skillLevel: 20, depth: 14, moveTime: 950, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 2200) return { 
        uciLimitStrength: true, uciElo: 2200, skillLevel: 20, depth: 15, moveTime: 1000, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2300) return {
        uciLimitStrength: true, uciElo: 2300, skillLevel: 20, depth: 16, moveTime: 1050, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2400) return {
        uciLimitStrength: true, uciElo: 2400, skillLevel: 20, depth: 17, moveTime: 1100, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };
    
    if (elo <= 2500) return { 
        uciLimitStrength: true, uciElo: 2500, skillLevel: 20, depth: 18, moveTime: 1200, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2600) return {
        uciLimitStrength: true, uciElo: 2600, skillLevel: 20, depth: 19, moveTime: 1350, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2700) return {
         uciLimitStrength: true, uciElo: 2700, skillLevel: 20, depth: 20, moveTime: 1500, useMultiPV: false, multiPVCount: 1,
         openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    if (elo <= 2900) return {
        uciLimitStrength: true, uciElo: 2900, skillLevel: 20, depth: 21, moveTime: 1800, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };

    return { 
        uciLimitStrength: false, skillLevel: 20, depth: 22, moveTime: 2000, useMultiPV: false, multiPVCount: 1,
        openingError: 0, midError: 0, endError: 0, goodChance: 0, inaccuracyChance: 0, mistakeChance: 0, missChance: 0, blunderChance: 0
    };
};

export const getDifficultyCategory = (elo: Difficulty): DifficultyCategory => {
    if (elo <= 900) return 'beginner';
    if (elo <= 1500) return 'intermediate';
    if (elo <= 1900) return 'advanced';
    return 'master'; // Covers Expert, Master, GM, Super GM, Ultimate
}

export type MoveClassification = 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder';

export type MoveAnalysis = {
    classification: MoveClassification;
    bestMove: { from: Square; to: Square; san: string } | null;
    evalBefore: number;
    evalAfter: number;
};

export type PlayerAnalysisSummary = {
    accuracy: number;
    moveCounts: Record<MoveClassification, number>;
};

export type GameAnalysis = {
    summary: {
        white: PlayerAnalysisSummary;
        black: PlayerAnalysisSummary;
    };
    details: (MoveAnalysis | null)[];
};

export type GameOverData = {
    winner: 'w' | 'b' | 'draw';
    reason: 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resignation' | 'result';
} | null;

export type HandicapSettings = {
  queen: 0 | 1;
  rook: 0 | 1 | 2;
  bishop: 0 | 1 | 2;
  knight: 0 | 1 | 2;
  pawn: number; // 0-8
};

export interface LayoutProps {
    game: Chess;
    fen: string;
    history: Move[];
    makeMove: (from: Square, to: Square, promotion?: string) => void;
    navigateToMove: (index: number) => void;
    currentMoveIndex: number;
    lastMove: { from: Square; to: Square } | null;
    getLegalMoves: (square: Square) => Move[];
    capturedPieces: {
        w: Piece[];
        b: Piece[];
    };
    materialAdvantage: number;
    gameOverData: GameOverData;
    evaluation: number;
    isComputerThinking: boolean;
    hintMove: { from: Square; to: Square } | null;
    gameMode: 'pvc' | 'pvp' | 'cvc';
    playerNames: {
        player1: string;
        player2: string;
    };
    player1Time: number | null;
    player2Time: number | null;
    handleRequestExit: () => void;
    showEvaluationBar: boolean;
    showMoveFeedback: boolean;
    analysisMode: boolean;
    analysisResults: (MoveAnalysis | null)[] | null;
    analysisBestMoveForPosition: { from: Square; to: Square; san: string } | null;
    currentMoveAnalysis: MoveAnalysis | null;
    enableHints: boolean;
    enablePieceRotation: boolean;
    handleControlClick: (action: ControlAction) => void;
    playerColor: 'w' | 'b';
    isPostGame: boolean;
    difficulty: Difficulty;
    enableTakebacks: boolean;
    engineDifficulties: { white: Difficulty, black: Difficulty };
    isSpectatorModePaused?: boolean;
    computerMove?: { from: Square; to: Square; promotion?: string } | null;
    playStyle?: PlayStyle;
    enginePlayStyles?: { white: PlayStyle; black: PlayStyle };
}
