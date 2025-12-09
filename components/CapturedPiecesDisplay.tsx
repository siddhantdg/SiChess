import React from 'react';
import { Piece } from 'chess.js';
import { pieceToSvg } from './Piece';

interface CapturedPiecesDisplayProps {
  pieces: Piece[];
  advantage: number;
}

// Order for sorting groups: Queen, Rook, Bishop, Knight, Pawn
const pieceOrder: { [key: string]: number } = { q: 1, r: 2, b: 3, n: 4, p: 5 };

export const CapturedPiecesDisplay: React.FC<CapturedPiecesDisplayProps> = ({ pieces, advantage }) => {

  const groupedPieces = pieces.reduce((acc, piece) => {
    if (!acc[piece.type]) {
      acc[piece.type] = [];
    }
    acc[piece.type].push(piece);
    return acc;
  }, {} as Record<string, Piece[]>);

  const sortedGroupKeys = Object.keys(groupedPieces).sort((a, b) => pieceOrder[a] - pieceOrder[b]);

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-0.5">
        {sortedGroupKeys.map((pieceType) => (
          <div key={pieceType} className="flex items-center">
            {groupedPieces[pieceType].map((piece, index) => {
              const pieceKey = `${piece.color}${piece.type}`;
              const src = pieceToSvg[pieceKey];
              if (!src) return null;

              return (
                <img
                  key={`${pieceType}-${index}`}
                  src={src}
                  alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
                  // Apply negative margin to create overlap for pieces of the same type
                  className={`w-5 h-5 ${index > 0 ? '-ml-3.5' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {advantage > 0 && (
        <span className="text-sm font-semibold text-zinc-500 ml-2">+{advantage}</span>
      )}
    </div>
  );
};