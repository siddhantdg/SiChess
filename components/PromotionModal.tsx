
import React from 'react';
import { pieceToSvg } from './Piece';

interface PromotionModalProps {
  color: 'w' | 'b';
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  style: React.CSSProperties;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect, style }) => {
  const pieces = ['q', 'r', 'b', 'n'] as const;

  return (
    <div 
        className={`absolute z-40 rounded-3xl shadow-[0_0_32px_rgba(0,0,0,0.50)] flex flex-col animate-scale-in overflow-hidden
  ${color === 'w'
    ? 'bg-[rgba(30,30,32,0.60)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)]'
    : 'bg-[rgba(255,255,255,0.50)] backdrop-blur-xl border border-[rgba(255,255,255,0.55)]'
  }
`}


        style={style}
    >
      {pieces.map((type) => {
        const pieceKey = `${color}${type}`;
        const src = pieceToSvg[pieceKey];
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full aspect-square flex items-center justify-center hover:bg-white/10 rounded-full transition-colors group"
          >
             <img 
                src={src} 
                alt={type} 
                className="w-[85%] h-[85%] object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-200"
             />
          </button>
        );
      })}
    </div>
  );
};
