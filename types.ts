
import { Square as ChessJsSquare, Piece as ChessJsPiece, Move, Chess } from 'chess.js';

export type Square = ChessJsSquare;
export type Piece = ChessJsPiece;

export type ControlAction = 'settings' | 'hint' | 'undo' | 'resign' | 'analyse';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';

export type MoveClassification = 'brilliant' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'miss' | 'blunder';

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
    reason: 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resignation';
} | null;

export interface LayoutProps {
    game: Chess;
    fen: string;
    history: Move[];
    makeMove: (from: Square, to: Square) => void;
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
    gameMode: 'pvc' | 'pvp';
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
}
