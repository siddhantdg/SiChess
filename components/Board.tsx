
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Chess, Square, Piece, Move } from 'chess.js';
import { PieceComponent } from './Piece';

interface BoardProps {
  fen: string;
  onMove: (from: Square, to: Square) => void;
  turn: 'w' | 'b';
  lastMove: { from: Square; to: Square } | null;
  getLegalMoves: (square: Square) => Move[];
  enablePieceRotation: boolean;
  hintMove: { from: Square; to: Square } | null;
  isInteractionDisabled?: boolean;
  analysisMode: boolean;
  analysisBestMoveForPosition?: { from: Square; to: Square } | null;
  currentMoveIndex: number;
  historyLength: number;
  onRequestNavigation: (index: number) => void;
  playerColor: 'w' | 'b';
}

type AnimationState = {
  status: 'idle' | 'preparing' | 'moving';
  piece: Piece | null;
  from: Square | null;
  to: Square | null;
  fromRect?: DOMRect; // Will store viewport-relative rectangle
};

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const Board: React.FC<BoardProps> = ({ 
    fen, 
    onMove, 
    turn, 
    lastMove, 
    getLegalMoves, 
    enablePieceRotation, 
    hintMove, 
    isInteractionDisabled,
    analysisMode,
    analysisBestMoveForPosition,
    currentMoveIndex,
    historyLength,
    onRequestNavigation,
    playerColor,
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ piece: Piece; from: Square } | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState>({ status: 'idle', piece: null, from: null, to: null });

  const boardRef = useRef<HTMLDivElement>(null);
  const gameInstance = useMemo(() => new Chess(fen), [fen]);

  const kingInCheckSquare = useMemo(() => {
    if (!gameInstance.isCheck()) return null;

    const kingColor = gameInstance.turn();
    const board = gameInstance.board();
    const boardRanks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const boardFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const piece = board[r][f];
            if (piece && piece.type === 'k' && piece.color === kingColor) {
                return `${boardFiles[f]}${boardRanks[r]}` as Square;
            }
        }
    }
    return null;
  }, [gameInstance]);

  const executeMove = (from: Square, to: Square) => {
    const piece = gameInstance.get(from);
    if (!piece || !boardRef.current) return;

    const fromElement = boardRef.current.querySelector(`[data-square="${from}"]`);
    if (!fromElement) return;

    const fromRect = fromElement.getBoundingClientRect();

    setAnimationState({
      status: 'preparing',
      piece,
      from,
      to,
      fromRect,
    });

    setDraggedPiece(null);
    setLegalMoves([]);
  };

  useEffect(() => {
    if (animationState.status === 'preparing') {
      const rafId = requestAnimationFrame(() => {
        setAnimationState(prev => ({ ...prev, status: 'moving' }));
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [animationState]);

  useEffect(() => {
    if (animationState.status === 'moving' && animationState.from && animationState.to) {
      const timeoutId = setTimeout(() => {
        onMove(animationState.from!, animationState.to!);
        setAnimationState({ status: 'idle', piece: null, from: null, to: null });
      }, 250); // Match the CSS transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [animationState, onMove]);


  // If user interacts with the board while viewing a past move, snap back to the latest move.
  const handleInteractionSnapBack = () => {
    if (!analysisMode && currentMoveIndex < historyLength) {
      onRequestNavigation(historyLength);
      return true; // Indicates snap back occurred
    }
    return false;
  };

  const handleDragStart = (piece: Piece, from: Square) => {
    if (handleInteractionSnapBack()) return;
    if (isInteractionDisabled || animationState.status !== 'idle') return;
    if (piece.color === turn) {
      setDraggedPiece({ piece, from });
      setLegalMoves(getLegalMoves(from));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (to: Square) => {
    if (handleInteractionSnapBack()) return;
    if (isInteractionDisabled || animationState.status !== 'idle') return;
    if (draggedPiece) {
      const isLegal = legalMoves.some(move => move.to === to);
      if (isLegal) {
        executeMove(draggedPiece.from, to);
      }
    }
    setDraggedPiece(null);
    setLegalMoves([]);
  };

  const handleSquareClick = (square: Square) => {
    if (handleInteractionSnapBack()) return;
    if (isInteractionDisabled || animationState.status !== 'idle') return;
    const pieceOnSquare = gameInstance.get(square);

    if (draggedPiece) {
      const isLegal = legalMoves.some(move => move.to === square);
      if (isLegal) {
        executeMove(draggedPiece.from, square);
      } else {
        setDraggedPiece(null);
        setLegalMoves([]);
      }
    } else if (pieceOnSquare && pieceOnSquare.color === turn) {
      setDraggedPiece({ piece: pieceOnSquare, from: square });
      setLegalMoves(getLegalMoves(square));
    }
  };

  const renderAnimatingPiece = () => {
    const { status, piece, from, to, fromRect } = animationState;
    if (status === 'idle' || !piece || !from || !to || !fromRect || !boardRef.current) return null;

    const toElement = boardRef.current.querySelector(`[data-square="${to}"]`);
    if (!toElement) return null;

    const boardRect = boardRef.current.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    const initialTop = fromRect.top - boardRect.top;
    const initialLeft = fromRect.left - boardRect.left;
    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;


    const style: React.CSSProperties = {
      position: 'absolute',
      width: `${fromRect.width}px`,
      height: `${fromRect.height}px`,
      top: `${initialTop}px`,
      left: `${initialLeft}px`,
      zIndex: 30,
      pointerEvents: 'none',
      transform: status === 'moving' ? `translate(${deltaX}px, ${deltaY}px)` : 'translate(0, 0)',
      transition: 'transform 250ms ease-in-out',
      willChange: 'transform',
    };

    return (
      <div style={style}>
        <PieceComponent
          piece={piece}
          onDragStart={() => {}}
          enablePieceRotation={enablePieceRotation}
          boardTurn={turn}
        />
      </div>
    );
  };
  
  const renderAnalysisArrow = () => {
    if (!analysisMode || !analysisBestMoveForPosition || !boardRef.current) return null;

    const { from, to } = analysisBestMoveForPosition;
    
    const fromEl = boardRef.current.querySelector(`[data-square="${from}"]`);
    const toEl = boardRef.current.querySelector(`[data-square="${to}"]`);
    
    if (!fromEl || !toEl) return null;

    const boardRect = boardRef.current.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const startX = fromRect.left - boardRect.left + fromRect.width / 2;
    const startY = fromRect.top - boardRect.top + fromRect.height / 2;
    const endX = toRect.left - boardRect.left + toRect.width / 2;
    const endY = toRect.top - boardRect.top + toRect.height / 2;

    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    const style: React.CSSProperties = {
      position: 'absolute',
      top: `${startY}px`,
      left: `${startX}px`,
      width: `${length}px`,
      transformOrigin: '0 50%',
      transform: `rotate(${angle}rad)`,
      zIndex: 5,
      pointerEvents: 'none',
    };
    
    const arrowHeadSize = fromRect.width * 0.4;
    
    return (
      <div style={style}>
        <svg width={length} height={fromRect.height} viewBox={`0 0 ${length} ${fromRect.height}`} className="overflow-visible">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="rgba(22, 163, 74, 0.8)" />
            </marker>
          </defs>
          <line
            x1="0"
            y1={fromRect.height / 2}
            x2={length - (arrowHeadSize / 2)}
            y2={fromRect.height / 2}
            stroke="rgba(22, 163, 74, 0.8)"
            strokeWidth={fromRect.width * 0.15}
            markerEnd="url(#arrowhead)"
          />
        </svg>
      </div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    const ranksToRender = playerColor === 'w' ? [...ranks].reverse() : ranks;
    const filesToRender = playerColor === 'w' ? files : [...files].reverse();

    for (const rank of ranksToRender) {
      for (const file of filesToRender) {
        const square = `${file}${rank}` as Square;
        const piece = gameInstance.get(square);
        const isLight = (files.indexOf(file) + parseInt(rank)) % 2 !== 0;

        const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
        const isLegalMoveSquare = legalMoves.some(move => move.to === square);
        const isCaptureSquare = isLegalMoveSquare && gameInstance.get(square);
        const isKingInCheck = kingInCheckSquare === square;
        const isHintFrom = hintMove && square === hintMove.from;
        const isHintTo = hintMove && square === hintMove.to;

        squares.push(
          <div
            key={square}
            data-square={square}
            className={`relative w-full aspect-square flex justify-center items-center ${
              isLight ? 'bg-[#eeeed2]' : 'bg-[#769656]'
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(square)}
            onClick={() => handleSquareClick(square)}
          >
            {isLastMoveSquare && !analysisMode && <div className="absolute inset-0 bg-yellow-400/40" />}
            {isKingInCheck && <div className="absolute inset-0 bg-red-900/40" />}
            {(isHintFrom || isHintTo) && <div className="absolute inset-0 bg-green-500/50 animate-pulse" />}
            <span className={`absolute text-xs font-bold top-0 left-1 ${isLight ? 'text-[#769656]' : 'text-[#eeeed2]'} select-none`}>
              {file === (playerColor === 'w' ? 'a' : 'h') ? rank : ''}
            </span>
            <span className={`absolute text-xs font-bold bottom-0 right-1 ${isLight ? 'text-[#769656]' : 'text-[#eeeed2]'} select-none`}>
              {rank === (playerColor === 'w' ? '1' : '8') ? file : ''}
            </span>
            {isLegalMoveSquare && !isCaptureSquare && (
              <div className="absolute w-1/3 h-1/3 rounded-full z-20 bg-black/20"></div>
            )}
            {isLegalMoveSquare && isCaptureSquare && (
              <div className="absolute inset-0 border-4 rounded-full z-20 box-border border-black/20"></div>
            )}
            {piece && (
              <PieceComponent
                piece={piece}
                onDragStart={() => handleDragStart(piece, square)}
                isHidden={animationState.status !== 'idle' && animationState.from === square}
                enablePieceRotation={enablePieceRotation}
                boardTurn={turn}
              />
            )}
          </div>
        );
      }
    }
    return squares;
  };

  return (
    <div className="shadow-lg max-w-full max-h-full aspect-square">
      <div ref={boardRef} className="relative w-full h-full">
        {renderAnalysisArrow()}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {renderBoard()}
        </div>
        {renderAnimatingPiece()}
      </div>
    </div>
  );
};
