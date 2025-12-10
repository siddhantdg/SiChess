
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Chess, Square, Piece, Move } from 'chess.js';
import { PieceComponent } from './Piece';
import { PromotionModal } from './PromotionModal';

interface BoardProps {
  fen: string;
  onMove: (from: Square, to: Square, promotion?: string) => void;
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
  history: Move[];
  onRequestNavigation: (index: number) => void;
  playerColor: 'w' | 'b';
  computerMoveToAnimate?: { from: Square; to: Square; promotion?: string } | null;
}

type AnimationState = {
  status: 'idle' | 'preparing' | 'moving';
  piece: Piece | null;
  from: Square | null;
  to: Square | null;
  fromRect?: DOMRect;
  rookFrom?: Square | null;
  rookTo?: Square | null;
  rookPiece?: Piece | null;
  rookFromRect?: DOMRect;
  promotionType?: string;
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
    history,
    onRequestNavigation,
    playerColor,
    computerMoveToAnimate,
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ piece: Piece; from: Square } | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState>({ status: 'idle', piece: null, from: null, to: null });
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const gameInstance = useMemo(() => new Chess(fen), [fen]);

  useEffect(() => {
    setPendingPromotion(null);
  }, [fen, currentMoveIndex, historyLength]);

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

  const startAnimation = useCallback((from: Square, to: Square, promotionType?: string) => {
      const piece = gameInstance.get(from);
      if (!piece || !boardRef.current) return;

      const fromElement = boardRef.current.querySelector(`[data-square="${from}"]`);
      if (!fromElement) return;

      const fromRect = fromElement.getBoundingClientRect();

      let rookFrom: Square | null = null;
      let rookTo: Square | null = null;
      let rookPiece: Piece | null = null;
      let rookFromRect: DOMRect | undefined = undefined;

      if (piece.type === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === 2) {
        const rank = from[1];
        const isKingside = to.charCodeAt(0) > from.charCodeAt(0);
        
        if (isKingside) {
          rookFrom = `h${rank}` as Square;
          rookTo = `f${rank}` as Square;
        } else {
          rookFrom = `a${rank}` as Square;
          rookTo = `d${rank}` as Square;
        }
        
        rookPiece = gameInstance.get(rookFrom);
        const rookElement = boardRef.current.querySelector(`[data-square="${rookFrom}"]`);
        if (rookElement) {
          rookFromRect = rookElement.getBoundingClientRect();
        }
      }

      setAnimationState({
        status: 'preparing',
        piece,
        from,
        to,
        fromRect,
        rookFrom,
        rookTo,
        rookPiece,
        rookFromRect,
        promotionType,
      });

      setDraggedPiece(null);
      setLegalMoves([]);
  }, [gameInstance]);

  const executeMove = useCallback((from: Square, to: Square, preSelectedPromotion?: string) => {
    const piece = gameInstance.get(from);
    if (!piece) return;

    // Check for pawn promotion
    const isPawn = piece.type === 'p';
    const isRank8 = to[1] === '8';
    const isRank1 = to[1] === '1';
    const isPromotion = isPawn && (isRank8 || isRank1);
    
    // If it is a promotion AND we don't have a pre-selected promotion type (e.g. from computer)
    // Then show the UI tray
    if (isPromotion && !preSelectedPromotion) {
        setPendingPromotion({ from, to });
        setDraggedPiece(null);
        setLegalMoves([]);
        return;
    }

    // Normal move or computer promotion? Start animation immediately.
    startAnimation(from, to, preSelectedPromotion);
  }, [gameInstance, startAnimation]);

  useEffect(() => {
    if (computerMoveToAnimate && animationState.status === 'idle') {
      executeMove(computerMoveToAnimate.from, computerMoveToAnimate.to, computerMoveToAnimate.promotion);
    }
  }, [computerMoveToAnimate, executeMove, animationState.status]);

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
          // Animation finished. Commit the move.
          onMove(animationState.from!, animationState.to!, animationState.promotionType);
          setAnimationState({ status: 'idle', piece: null, from: null, to: null });
      }, 200); // Match the CSS transition duration
      return () => clearTimeout(timeoutId);
    }
  }, [animationState, onMove]);


  const handleInteractionSnapBack = () => {
    if (!analysisMode && currentMoveIndex < historyLength) {
      onRequestNavigation(historyLength);
      return true; 
    }
    return false;
  };

  const handleDragStart = (piece: Piece, from: Square) => {
    if (handleInteractionSnapBack()) return;
    if (isInteractionDisabled || animationState.status !== 'idle' || pendingPromotion) return;
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
    if (isInteractionDisabled || animationState.status !== 'idle' || pendingPromotion) return;
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
    if (isInteractionDisabled || animationState.status !== 'idle' || pendingPromotion) return;
    const pieceOnSquare = gameInstance.get(square);

    if (draggedPiece) {
      const isLegal = legalMoves.some(move => move.to === square);
      if (isLegal) {
        executeMove(draggedPiece.from, square);
      } else {
        // If clicking on another piece of own color, switch selection
        if (pieceOnSquare && pieceOnSquare.color === turn) {
            setDraggedPiece({ piece: pieceOnSquare, from: square });
            setLegalMoves(getLegalMoves(square));
        } else {
            // Clicking elsewhere clears selection
            setDraggedPiece(null);
            setLegalMoves([]);
        }
      }
    } else if (pieceOnSquare && pieceOnSquare.color === turn) {
      setDraggedPiece({ piece: pieceOnSquare, from: square });
      setLegalMoves(getLegalMoves(square));
    }
  };
  
  const handlePromotionSelect = (piece: 'q' | 'r' | 'b' | 'n') => {
      if (pendingPromotion) {
          const { from, to } = pendingPromotion;
          // 1. Close the tray
          setPendingPromotion(null);
          // 2. Start the slide animation using the selected piece type
          startAnimation(from, to, piece);
      }
  };

const renderAnimatingPiece = () => {
  const { status, piece, fromRect, rookFrom, rookTo, rookPiece, rookFromRect } = animationState;
  if (status === 'idle' || !piece || !fromRect || !boardRef.current) return null;

  const toElement = boardRef.current.querySelector(`[data-square="${animationState.to}"]`);
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: status === 'moving' ? `translate(${deltaX}px, ${deltaY}px)` : 'translate(0, 0)',
    transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    willChange: 'transform',
  };

  let rookStyle: React.CSSProperties | null = null;
  if (rookFrom && rookTo && rookPiece && rookFromRect) {
    const rookToElement = boardRef.current.querySelector(`[data-square="${rookTo}"]`);
    if (rookToElement) {
      const rookToRect = rookToElement.getBoundingClientRect();
      
      const rookInitialTop = rookFromRect.top - boardRect.top;
      const rookInitialLeft = rookFromRect.left - boardRect.left;
      const rookDeltaX = rookToRect.left - rookFromRect.left;
      const rookDeltaY = rookToRect.top - rookFromRect.top;

      rookStyle = {
        position: 'absolute',
        width: `${rookFromRect.width}px`,
        height: `${rookFromRect.height}px`,
        top: `${rookInitialTop}px`,
        left: `${rookInitialLeft}px`,
        zIndex: 30,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: status === 'moving' ? `translate(${rookDeltaX}px, ${rookDeltaY}px)` : 'translate(0, 0)',
        transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        willChange: 'transform',
      };
    }
  }

  return (
    <>
      <div style={style}>
        <PieceComponent
          piece={piece}
          onDragStart={() => {}}
          enablePieceRotation={enablePieceRotation}
          boardTurn={turn}
        />
      </div>
      
      {rookStyle && rookPiece && (
        <div style={rookStyle}>
          <PieceComponent
            piece={rookPiece}
            onDragStart={() => {}}
            enablePieceRotation={enablePieceRotation}
            boardTurn={turn}
          />
        </div>
      )}
    </>
  );
};
  
  const renderArrow = (from: Square, to: Square, isAnimated = false) => {
    if (!boardRef.current) return null;

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
    
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return null;

    // Vector math for arrow shape
    const ux = dx / length; // unit vector x
    const uy = dy / length; // unit vector y
    const px = -uy; // perpendicular vector x
    const py = ux;  // perpendicular vector y

    const squareWidth = fromRect.width;
    const shaftWidth = squareWidth * 0.25;
    const headWidth = squareWidth * 0.5;
    const headLength = squareWidth * 0.4;
    
    if (length < headLength) return null; 

    const neckX = endX - headLength * ux;
    const neckY = endY - headLength * uy;

    const points = [
        // start of shaft
        `${startX + (shaftWidth / 2) * px},${startY + (shaftWidth / 2) * py}`,
        // neck of arrow, where shaft meets head (wider part)
        `${neckX + (shaftWidth / 2) * px},${neckY + (shaftWidth / 2) * py}`,
        // corner of arrowhead
        `${neckX + (headWidth / 2) * px},${neckY + (headWidth / 2) * py}`,
        // tip of arrow
        `${endX},${endY}`,
        // other corner of arrowhead
        `${neckX - (headWidth / 2) * px},${neckY - (headWidth / 2) * py}`,
        // other side of neck
        `${neckX - (shaftWidth / 2) * px},${neckY - (shaftWidth / 2) * py}`,
        // other side of start of shaft
        `${startX - (shaftWidth / 2) * px},${startY - (shaftWidth / 2) * py}`,
    ].join(' ');

    const gradId = `arrow-grad-${from}-${to}`;
    
    // Fade starts at 0 and is fully opaque by ~15% of a square width (approx 5-10px visually)
    const fadeDist = squareWidth * 0.60;
    const fadePercent = Math.min(100, (fadeDist / length) * 100);

    return (
        <svg
            key={`arrow-${from}-${to}`}
            className={isAnimated ? "animate-fade-in-out" : ""}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 20,
            }}
        >
            <defs>
                <linearGradient id={gradId} x1={startX} y1={startY} x2={endX} y2={endY} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="rgba(22, 163, 74, 0)" />
                    <stop offset={`${fadePercent}%`} stopColor="rgba(22, 163, 74, 0.85)" />
                    <stop offset="100%" stopColor="rgba(22, 163, 74, 0.85)" />
                </linearGradient>
            </defs>
            <polygon points={points} fill={`url(#${gradId})`} />
        </svg>
    );
  };

  const renderPromotionModal = () => {
    if (!pendingPromotion || !boardRef.current) return null;

    // Find visual coordinates
    const toSquare = pendingPromotion.to;
    const fileIndex = files.indexOf(toSquare[0]);
    const rankIndex = parseInt(toSquare[1]) - 1;

    // If player is white, rank 8 (index 7) is row 0. 
    // If player is black, rank 1 (index 0) is row 0.
    const isPlayerWhite = playerColor === 'w';
    
    // Visual Column (0-7, left to right)
    const visualCol = isPlayerWhite ? fileIndex : 7 - fileIndex;
    
    // Visual Row (0-7, top to bottom)
    const visualRow = isPlayerWhite ? 7 - rankIndex : rankIndex;

    const top = `${visualRow * 12.5}%`;
    const left = `${visualCol * 12.5}%`;
    const width = '12.5%';
    
    // Determine expansion direction
    let modalStyle: React.CSSProperties = {
        left: left,
        width: width,
    };
    
    
    if (visualRow < 4) {
        modalStyle.top = '0%';
        modalStyle.flexDirection = 'column';
    } else {
        modalStyle.bottom = '0%'; 
        modalStyle.flexDirection = 'column-reverse'; 
    }

    return (
        <PromotionModal
            color={turn}
            onSelect={handlePromotionSelect}
            style={modalStyle}
        />
    );
  };


  const renderBoard = () => {
    const squares = [];
    const ranksToRender = playerColor === 'w' ? [...ranks].reverse() : ranks;
    const filesToRender = playerColor === 'w' ? files : [...files].reverse();
    const reviewedMove = analysisMode && currentMoveIndex > 0 ? history[currentMoveIndex - 1] : null;

    for (const rank of ranksToRender) {
      for (const file of filesToRender) {
        const square = `${file}${rank}` as Square;
        const piece = gameInstance.get(square);
        const isLight = (files.indexOf(file) + parseInt(rank)) % 2 !== 0;

        const isLastMoveSquare = lastMove && (square === lastMove.from || square === lastMove.to);
        const isReviewedMoveSquare = reviewedMove && (square === reviewedMove.from || square === reviewedMove.to);
        const isLegalMoveSquare = legalMoves.some(move => move.to === square);
        const isCaptureSquare = isLegalMoveSquare && gameInstance.get(square);
        const isKingInCheck = kingInCheckSquare === square;
        const isHintFrom = hintMove && square === hintMove.from;
        const isHintTo = hintMove && square === hintMove.to;

        const isSelected = draggedPiece && square === draggedPiece.from;
        const isAnimatingFrom = animationState.status !== 'idle' && animationState.from === square;
        const isAnimatingTo = animationState.status !== 'idle' && animationState.to === square;
        
        const isPendingPromotionTo = pendingPromotion && pendingPromotion.to === square;
        
        const shouldHighlight = !analysisMode && (isLastMoveSquare || isSelected || isAnimatingFrom || isAnimatingTo || isPendingPromotionTo);

        
        const shouldHidePiece = (animationState.status !== 'idle' && (
            animationState.from === square || 
            animationState.rookFrom === square
        ));

        const isCapturedPiece = animationState.status !== 'idle' && 
                              animationState.to === square && 
                              piece && 
                              piece.color !== turn;

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
            {shouldHighlight && <div className="absolute inset-0 bg-yellow-400/40" />}
            {isReviewedMoveSquare && <div className="absolute inset-0 bg-yellow-400/40" />}
            {isKingInCheck && <div className="absolute inset-0 bg-red-900/40" />}
            
            {(isHintFrom || isHintTo) && <div className="absolute inset-0 bg-[rgba(200,200,200,0.28)] backdrop-blur-[2px] animate-fade-in-out pointer-events-none" />}
            
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
                isHidden={shouldHidePiece}
                isFadingOut={!!isCapturedPiece}
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
        {analysisMode && analysisBestMoveForPosition && renderArrow(analysisBestMoveForPosition.from, analysisBestMoveForPosition.to)}
        {!analysisMode && hintMove && renderArrow(hintMove.from, hintMove.to, true)}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {renderBoard()}
        </div>
        {renderAnimatingPiece()}
        {renderPromotionModal()}
      </div>
    </div>
  );
};
