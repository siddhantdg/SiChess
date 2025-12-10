
import React from 'react';
import { Piece } from 'chess.js';

interface PieceProps {
  piece: Piece;
  onDragStart: () => void;
  isHidden?: boolean;
  enablePieceRotation?: boolean;
  boardTurn?: 'w' | 'b';
  isFadingOut?: boolean;
}

export const pieceToSvg: Record<string, string> = {
    'wp': "/assets/pieces/default/wp.png",
    'wn': "/assets/pieces/default/wn.png",
    'wb': "/assets/pieces/default/wb.png",
    'wr': "/assets/pieces/default/wr.png",
    'wq': "/assets/pieces/default/wq.png",
    'wk': "/assets/pieces/default/wk.png",
    'bp': "/assets/pieces/default/bp.png",
    'bn': "/assets/pieces/default/bn.png",
    'bb': "/assets/pieces/default/bb.png",
    'br': "/assets/pieces/default/br.png",
    'bq': "/assets/pieces/default/bq.png",
    'bk': "/assets/pieces/default/bk.png",
};


export const PieceComponent: React.FC<PieceProps> = ({ piece, onDragStart, isHidden, enablePieceRotation, boardTurn, isFadingOut }) => {
  const pieceKey = `${piece.color}${piece.type}`;
  const src = pieceToSvg[pieceKey];

  const rotationClass = enablePieceRotation && boardTurn === 'b' ? 'rotate-180' : 'rotate-0';
  
  // If isHidden is true, opacity-0 applies instantly (unless transition overrides, but we use isHidden for instant hiding)
  // If isFadingOut is true, we apply opacity-0 with a delay and transition to create the fade effect
  const fadeClass = isFadingOut 
    ? 'transition-opacity duration-100 delay-100 opacity-0 ease-out' 
    : '';

  return (
    <div
      draggable="true"
      onDragStart={onDragStart}
      className={`cursor-grab active:cursor-grabbing w-[85%] h-[85%] z-10 ${rotationClass} ${isHidden ? 'opacity-0' : ''} ${fadeClass}`}
      style={{ backgroundImage: `url(${src})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      aria-label={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
    />
  );
};
