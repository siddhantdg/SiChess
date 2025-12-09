import { Square as ChessJsSquare, Piece as ChessJsPiece, Move } from 'chess.js';

export type Square = ChessJsSquare;
export type Piece = ChessJsPiece;

export type GameOverData = {
    winner: 'w' | 'b' | 'draw';
    reason: 'checkmate' | 'stalemate' | 'draw' | 'timeout';
} | null;