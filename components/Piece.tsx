import React from 'react';
import { Piece } from 'chess.js';

interface PieceProps {
  piece: Piece;
  onDragStart: () => void;
  isHidden?: boolean;
  enablePieceRotation?: boolean;
  boardTurn?: 'w' | 'b';
}

export const pieceToSvg: Record<string, string> = {
    'wp': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png",
    'wn': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png",
    'wb': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png",
    'wr': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png",
    'wq': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png",
    'wk': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png",
    'bp': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png",
    'bn': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png",
    'bb': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png",
    'br': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png",
    'bq': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png",
    'bk': "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png",
};


export const PieceComponent: React.FC<PieceProps> = ({ piece, onDragStart, isHidden, enablePieceRotation, boardTurn }) => {
  const pieceKey = `${piece.color}${piece.type}`;
  const src = pieceToSvg[pieceKey];

  const rotationClass = enablePieceRotation && boardTurn === 'b' ? 'rotate-180' : 'rotate-0';

  return (
    <div
      draggable="true"
      onDragStart={onDragStart}
      className={`cursor-grab active:cursor-grabbing w-[85%] h-[85%] z-10 ${rotationClass} ${isHidden ? 'opacity-0' : ''}`}
      style={{ backgroundImage: `url(${src})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      aria-label={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
    />
  );
};