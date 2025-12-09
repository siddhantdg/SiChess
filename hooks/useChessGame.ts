
import { useState, useCallback, useEffect } from 'react';
import { Chess, Square, Move, Piece } from 'chess.js';
import { GameOverData, Difficulty } from '../types';
import { findComputerMove, getEvaluation } from '../services/chessEngine';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const useChessGame = (gameMode: 'pvc' | 'pvp', computerColor: 'w' | 'b' | null, difficulty: Difficulty) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0); // 0 = start, 1 = move 1, etc.
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ w: Piece[], b: Piece[] }>({ w: [], b: [] });
  const [materialAdvantage, setMaterialAdvantage] = useState(0);
  const [gameOverData, setGameOverData] = useState<GameOverData>(null);
  
  const [evaluation, setEvaluation] = useState(0);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [hintMove, setHintMove] = useState<{ from: Square, to: Square } | null>(null);

  const calculateCapturedAndAdvantage = useCallback((currentFen: string) => {
    const pieceValues: { [key: string]: number } = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    const initialCounts: { [key: string]: number } = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    
    const currentCounts = {
        w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
        b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
    };
    let whiteScore = 0;
    let blackScore = 0;

    currentFen.split(' ')[0].split('/').forEach(row => {
        for (const char of row) {
            if (isNaN(parseInt(char))) { // It's a piece
                const color = char === char.toUpperCase() ? 'w' : 'b';
                const type = char.toLowerCase() as keyof typeof pieceValues;
                if (pieceValues[type]) {
                    currentCounts[color][type]++;
                    if (color === 'w') whiteScore += pieceValues[type];
                    else blackScore += pieceValues[type];
                }
            }
        }
    });
    
    const captured = { w: [] as Piece[], b: [] as Piece[] };
    
    for (const color of ['w', 'b'] as const) {
        for (const type of ['q', 'r', 'b', 'n', 'p'] as const) {
            const capturedCount = initialCounts[type] - currentCounts[color][type];
            for (let i = 0; i < capturedCount; i++) {
                captured[color].push({ color, type });
            }
        }
    }
    
    setCapturedPieces(captured);
    setMaterialAdvantage(whiteScore - blackScore);
  }, []);
  
  // Recalculate evaluation on FEN change
  useEffect(() => {
    const newGame = new Chess(fen);
    setGame(newGame);
    setEvaluation(getEvaluation(newGame));
  }, [fen]);

  const makeMoveInternal = useCallback((move: Move) => {
    const gameCopy = new Chess(fen);
    const madeMove = gameCopy.move(move);

    if (madeMove) {
      const newHistory = history.slice(0, currentMoveIndex);
      const updatedHistory = [...newHistory, madeMove];
      const newMoveIndex = updatedHistory.length;
      
      setHistory(updatedHistory);
      setCurrentMoveIndex(newMoveIndex);
      setFen(gameCopy.fen());
      setLastMove({ from: madeMove.from, to: madeMove.to });
      calculateCapturedAndAdvantage(gameCopy.fen());
      setHintMove(null);
      
      if (gameCopy.isGameOver()) {
        if (gameCopy.isCheckmate()) {
          setGameOverData({
            winner: gameCopy.turn() === 'b' ? 'w' : 'b',
            reason: 'checkmate'
          });
        } else if (gameCopy.isStalemate()) {
          setGameOverData({ winner: 'draw', reason: 'stalemate' });
        } else {
          setGameOverData({ winner: 'draw', reason: 'draw' });
        }
      }
    }
  }, [fen, history, currentMoveIndex, calculateCapturedAndAdvantage]);
  
  const makeMove = useCallback((from: Square, to: Square) => {
    const gameCopy = new Chess(fen);
    const piece = gameCopy.get(from);

    let moveObject: { from: Square; to: Square; promotion?: 'q' } = { from, to };

    // Check for pawn promotion
    if (
      piece &&
      piece.type === 'p' &&
      ((piece.color === 'w' && from[1] === '7' && to[1] === '8') ||
       (piece.color === 'b' && from[1] === '2' && to[1] === '1'))
    ) {
      moveObject.promotion = 'q'; // Auto-promote to queen
    }
    
    makeMoveInternal(moveObject as Move);
  }, [fen, makeMoveInternal]);
  
  // Handle computer's move
  useEffect(() => {
    const gameInstance = new Chess(fen);
    if (gameMode === 'pvc' && computerColor && gameInstance.turn() === computerColor && !gameInstance.isGameOver() && currentMoveIndex === history.length) {
      setIsComputerThinking(true);
      findComputerMove(gameInstance, difficulty).then(move => {
        if (move) {
          setTimeout(() => {
            makeMoveInternal(move);
            setIsComputerThinking(false);
          }, 500); // Artificial delay
        } else {
          setIsComputerThinking(false);
        }
      });
    }
  }, [fen, gameMode, computerColor, makeMoveInternal, currentMoveIndex, history.length, difficulty]);
  
  const resetGame = useCallback(() => {
    setFen(INITIAL_FEN);
    setHistory([]);
    setCurrentMoveIndex(0);
    setLastMove(null);
    setGameOverData(null);
    calculateCapturedAndAdvantage(INITIAL_FEN);
  }, [calculateCapturedAndAdvantage]);

  const navigateToMove = useCallback((index: number) => {
      const newGame = new Chess();
      const targetIndex = Math.max(0, Math.min(history.length, index));

      for(let i = 0; i < targetIndex; i++){
          newGame.move(history[i]);
      }
      
      setFen(newGame.fen());
      setCurrentMoveIndex(targetIndex);
      const lastMoveInHistory = targetIndex > 0 ? history[targetIndex - 1] : null;
      setLastMove(lastMoveInHistory ? { from: lastMoveInHistory.from, to: lastMoveInHistory.to } : null);
      
      calculateCapturedAndAdvantage(newGame.fen());

  }, [history, calculateCapturedAndAdvantage]);

  const undoMove = useCallback(() => {
    if (currentMoveIndex > 0) {
      let movesToUndo = 1;
      
      // In Player vs Computer mode, if it's the player's turn, the computer just moved.
      // To undo the player's last move, we must also undo the computer's response.
      if (gameMode === 'pvc' && computerColor && currentMoveIndex === history.length && game.turn() !== computerColor) {
        movesToUndo = 2;
      }
  
      const targetIndex = Math.max(0, currentMoveIndex - movesToUndo);
      navigateToMove(targetIndex);
      setHistory(prev => prev.slice(0, targetIndex));
      setGameOverData(null); // After undoing, the game is no longer over.
    }
  }, [currentMoveIndex, history, gameMode, game, computerColor, navigateToMove]);

  const getLegalMoves = useCallback((square: Square) => {
    return new Chess(fen).moves({ square, verbose: true });
  }, [fen]);

  const requestHint = useCallback(async () => {
    const bestMove = await findComputerMove(new Chess(fen), 'master'); // Hint uses master difficulty
    if(bestMove){
        setHintMove({ from: bestMove.from, to: bestMove.to });
        setTimeout(() => setHintMove(null), 2000); // clear hint after 2s
    }
  }, [fen]);

  return {
    game,
    fen,
    history,
    makeMove,
    undoMove,
    resetGame,
    navigateToMove,
    currentMoveIndex,
    lastMove,
    getLegalMoves,
    capturedPieces,
    materialAdvantage,
    gameOverData,
    setGameOverData,
    evaluation,
    isComputerThinking,
    hintMove,
    requestHint,
  };
};
