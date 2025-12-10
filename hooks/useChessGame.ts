
import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square, Move, Piece } from 'chess.js';
import { GameOverData, Difficulty, HandicapSettings, PlayStyle } from '../types';
import { findComputerMove, getEvaluation, findBestMoveForFeedback } from '../services/chessEngine';
import { playSound } from '../services/soundManager';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const generateChess960Fen = (): string => {
    const rank = Array(8).fill(null);

    const lightSquares = [0, 2, 4, 6];
    const darkSquares = [1, 3, 5, 7];
    const bishop1Idx = lightSquares[Math.floor(Math.random() * 4)];
    const bishop2Idx = darkSquares[Math.floor(Math.random() * 4)];
    rank[bishop1Idx] = 'B';
    rank[bishop2Idx] = 'B';

    const remainingPieces = ['Q', 'N', 'N'];
    for (const piece of remainingPieces) {
        let placed = false;
        while (!placed) {
            const idx = Math.floor(Math.random() * 8);
            if (rank[idx] === null) {
                rank[idx] = piece;
                placed = true;
            }
        }
    }

    const rookKingRook = ['R', 'K', 'R'];
    let rkrIdx = 0;
    for (let i = 0; i < 8; i++) {
        if (rank[i] === null) {
            rank[i] = rookKingRook[rkrIdx++];
        }
    }

    const whiteRank = rank.join('');
    const blackRank = whiteRank.toLowerCase();
    
    return `${blackRank}/pppppppp/8/8/8/8/PPPPPPPP/${whiteRank} w KQkq - 0 1`;
};

const applyHandicapToFen = (fen: string, handicap: HandicapSettings, computerColor: 'w' | 'b'): string => {
    const fenParts = fen.split(' ');
    const ranks = fenParts[0].split('/');
    let castlingRights = fenParts[2];
    
    const expandRank = (r: string): (string | null)[] => {
        const expanded: (string | null)[] = [];
        for (const char of r) {
            if (isNaN(parseInt(char))) {
                expanded.push(char);
            } else {
                for (let i = 0; i < parseInt(char); i++) {
                    expanded.push(null);
                }
            }
        }
        return expanded;
    };

    const compressRank = (arr: (string | null)[]): string => {
        let compressed = '';
        let emptyCount = 0;
        for (const char of arr) {
            if (char === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    compressed += emptyCount;
                    emptyCount = 0;
                }
                compressed += char;
            }
        }
        if (emptyCount > 0) {
            compressed += emptyCount;
        }
        return compressed;
    };
    
    const getPieceChar = (piece: 'p' | 'n' | 'b' | 'r' | 'q') => {
        return computerColor === 'w' ? piece.toUpperCase() : piece.toLowerCase();
    };

    const backRankIndex = computerColor === 'w' ? 7 : 0;
    let expandedBackRank = expandRank(ranks[backRankIndex]);

    if (handicap.queen === 1) {
        const queenChar = getPieceChar('q');
        const queenIndex = expandedBackRank.indexOf(queenChar);
        if (queenIndex !== -1) {
            expandedBackRank[queenIndex] = null;
        }
    }

    const rookChar = getPieceChar('r');
    if (handicap.rook >= 1) { // Queenside Rook (a-file)
        if (expandedBackRank[0] === rookChar) {
            expandedBackRank[0] = null;
            const castlingChar = computerColor === 'w' ? 'Q' : 'q';
            castlingRights = castlingRights.replace(castlingChar, '');
        }
    }
    if (handicap.rook >= 2) { // Kingside Rook (h-file)
        if (expandedBackRank[7] === rookChar) {
            expandedBackRank[7] = null;
            const castlingChar = computerColor === 'w' ? 'K' : 'k';
            castlingRights = castlingRights.replace(castlingChar, '');
        }
    }

    const bishopChar = getPieceChar('b');
    if (handicap.bishop >= 1) { // Queenside Bishop (c-file)
        if (expandedBackRank[2] === bishopChar) expandedBackRank[2] = null;
    }
    if (handicap.bishop >= 2) { // Kingside Bishop (f-file)
        if (expandedBackRank[5] === bishopChar) expandedBackRank[5] = null;
    }
    
    const knightChar = getPieceChar('n');
    if (handicap.knight >= 1) { // Queenside Knight (b-file)
        if (expandedBackRank[1] === knightChar) expandedBackRank[1] = null;
    }
    if (handicap.knight >= 2) { // Kingside Knight (g-file)
        if (expandedBackRank[6] === knightChar) expandedBackRank[6] = null;
    }

    ranks[backRankIndex] = compressRank(expandedBackRank);
    
    if (handicap.pawn > 0) {
        const pawnRankIndex = computerColor === 'w' ? 6 : 1;
        let expandedPawnRank = expandRank(ranks[pawnRankIndex]);
        const pawnChar = getPieceChar('p');
        
        // Pawn Removal Priority List (indices for files: a, h, b, g, c, f, d, e)
        const pawnRemovalPriority = [0, 7, 1, 6, 2, 5, 3, 4];

        for (let i = 0; i < handicap.pawn; i++) {
            const fileIndexToRemove = pawnRemovalPriority[i];
            if (fileIndexToRemove < expandedPawnRank.length && expandedPawnRank[fileIndexToRemove] === pawnChar) {
                expandedPawnRank[fileIndexToRemove] = null;
            }
        }
        ranks[pawnRankIndex] = compressRank(expandedPawnRank);
    }
    
    fenParts[0] = ranks.join('/');
    
    if (castlingRights === '') castlingRights = '-';
    fenParts[2] = castlingRights;
    
    return fenParts.join(' ');
};

export const useChessGame = (
    gameMode: 'pvc' | 'pvp' | 'cvc',
    computerColor: 'w' | 'b' | null,
    difficulty: Difficulty,
    engineDifficulties?: { white: Difficulty; black: Difficulty },
    isSpectatorModePaused?: boolean,
    isGameStarting?: boolean,
    playStyle: PlayStyle = 'balanced',
    enginePlayStyles?: { white: PlayStyle; black: PlayStyle }
) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [initialFen, setInitialFen] = useState(INITIAL_FEN);
  const [history, setHistory] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0); // 0 = start, 1 = move 1, etc.
  const [lastMove, setLastMove] = useState<{ from: Square, to: Square } | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{ w: Piece[], b: Piece[] }>({ w: [], b: [] });
  const [materialAdvantage, setMaterialAdvantage] = useState(0);
  const [gameOverData, setGameOverData] = useState<GameOverData>(null);
  
  const [evaluation, setEvaluation] = useState(0);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [hintMove, setHintMove] = useState<{ from: Square, to: Square } | null>(null);
  const [computerMove, setComputerMove] = useState<{ from: Square, to: Square, promotion?: string } | null>(null);
  const [liveBestMove, setLiveBestMove] = useState<{ from: Square, to: Square, san: string } | null>(null);

  const moveRequestCounter = useRef(0);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateCapturedAndAdvantage = useCallback((currentFen: string, initialFenForGame: string) => {
    const pieceValues: { [key: string]: number } = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    
    const countPieces = (fenString: string): { [key: string]: number } => {
        const counts: { [key: string]: number } = {};
        fenString.split(' ')[0].split('/').forEach(row => {
            for (const char of row) {
                if (isNaN(parseInt(char))) {
                    counts[char] = (counts[char] || 0) + 1;
                }
            }
        });
        return counts;
    };
    
    const initialPieceCounts = countPieces(initialFenForGame);
    const currentPieceCounts = countPieces(currentFen);

    const allPieceTypes = "PNBRQKpnbrqk";
    const captured = { w: [] as Piece[], b: [] as Piece[] };
    let whiteScore = 0;
    let blackScore = 0;

    for(const char of allPieceTypes) {
        const initialCount = initialPieceCounts[char] || 0;
        const currentCount = currentPieceCounts[char] || 0;
        const capturedCount = initialCount - currentCount;
        
        const color = char === char.toUpperCase() ? 'w' : 'b';
        const type = char.toLowerCase() as Piece['type'];

        if (pieceValues[type]) {
            if (color === 'w') whiteScore += currentCount * pieceValues[type];
            else blackScore += currentCount * pieceValues[type];
        }

        if (capturedCount > 0) {
            for (let i = 0; i < capturedCount; i++) {
                captured[color].push({ color, type });
            }
        }
    }
    
    setCapturedPieces(captured);
    setMaterialAdvantage(whiteScore - blackScore);
  }, []);
  
  useEffect(() => {
    const newGame = new Chess(fen);
    setGame(newGame);
    
    if (!newGame.isGameOver()) {
        getEvaluation(fen).then(score => {
            setEvaluation(score);
        });
    }
  }, [fen]);

  useEffect(() => {
      if (history.length === 0 || isGameStarting) {
          setLiveBestMove(null);
          return;
      }

      let isMounted = true;

      const runFeedbackAnalysis = async () => {
          const gameForPrev = new Chess(initialFen);
          for (let i = 0; i < history.length - 1; i++) {
              gameForPrev.move(history[i]);
          }

          const result = await findBestMoveForFeedback(gameForPrev, 10); // Fast depth

          if (isMounted && result) {
              const tempGame = new Chess(gameForPrev.fen());
              try {
                  const moveObj = tempGame.move({
                      from: result.from,
                      to: result.to,
                      promotion: 'q' 
                  });
                  setLiveBestMove({ from: result.from as Square, to: result.to as Square, san: moveObj.san });
              } catch (e) {
              }
          }
      };

      runFeedbackAnalysis();

      return () => { isMounted = false; };
  }, [history, initialFen, isGameStarting]);

  const makeMoveInternal = useCallback((move: Move) => {
    const gameCopy = new Chess(fen);
    const isComputerMove = (gameMode === 'pvc' && gameCopy.turn() === computerColor && computerColor !== null) || gameMode === 'cvc';
    const madeMove = gameCopy.move(move);

    if (madeMove) {
      if (isComputerMove) {
        setComputerMove(null);
        setIsComputerThinking(false);
      }

      const newHistory = history.slice(0, currentMoveIndex);
      const updatedHistory = [...newHistory, madeMove];
      const newMoveIndex = updatedHistory.length;
      
      setHistory(updatedHistory);
      setCurrentMoveIndex(newMoveIndex);
      setFen(gameCopy.fen());
      setLastMove({ from: madeMove.from, to: madeMove.to });
      calculateCapturedAndAdvantage(gameCopy.fen(), initialFen);
      setHintMove(null);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
      
      if (gameCopy.isGameOver()) {
        playSound('gameEnd');
      } else if (gameCopy.isCheck()) {
        playSound('check');
      } else if (madeMove.flags.includes('p')) {
        playSound('promote');
      } else if (madeMove.flags.includes('k') || madeMove.flags.includes('q')) {
        playSound('castle');
      } else if (madeMove.captured) {
        playSound('capture');
      } else {
        playSound('move');
      }

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
  }, [fen, history, currentMoveIndex, calculateCapturedAndAdvantage, initialFen, gameMode, computerColor]);
  
  const makeMove = useCallback((from: Square, to: Square, promotion?: string) => {
    const gameCopy = new Chess(fen);
    const piece = gameCopy.get(from);

    let moveObject: { from: Square; to: Square; promotion?: string } = { from, to };

    // Check for pawn promotion
    if (
      piece &&
      piece.type === 'p' &&
      ((piece.color === 'w' && from[1] === '7' && to[1] === '8') ||
       (piece.color === 'b' && from[1] === '2' && to[1] === '1'))
    ) {
      // If promotion is provided by UI, use it. Otherwise default to 'q' (mostly for engine/test safety)
      moveObject.promotion = promotion || 'q';
    }
    
    makeMoveInternal(moveObject as Move);
  }, [fen, makeMoveInternal]);
  
    useEffect(() => {
        const gameInstance = new Chess(fen);
        const isGameOver = gameInstance.isGameOver();
        const isAtLatestMove = currentMoveIndex === history.length;

        if (gameMode === 'pvp' || isSpectatorModePaused || isGameOver || !isAtLatestMove || isGameStarting || isComputerThinking) {
            return;
        }

        let difficultyForTurn: Difficulty | null = null;
        let styleForTurn: PlayStyle = 'balanced';

        if (gameMode === 'pvc' && computerColor && gameInstance.turn() === computerColor) {
            difficultyForTurn = difficulty;
            styleForTurn = playStyle;
        } else if (gameMode === 'cvc' && engineDifficulties) {
            difficultyForTurn = gameInstance.turn() === 'w' ? engineDifficulties.white : engineDifficulties.black;
            if (enginePlayStyles) {
                styleForTurn = gameInstance.turn() === 'w' ? enginePlayStyles.white : enginePlayStyles.black;
            }
        }

        if (difficultyForTurn !== null) {
            setIsComputerThinking(true);
            const moveRequestId = moveRequestCounter.current;
            const delay = gameMode === 'cvc' ? 500 : 250;
            
             setTimeout(() => {
                 if (moveRequestCounter.current !== moveRequestId) return;
                 
                 findComputerMove(gameInstance, difficultyForTurn!, styleForTurn).then(move => {
                    if (moveRequestCounter.current !== moveRequestId) {
                        setIsComputerThinking(false);
                        return;
                    }

                    if (move) {
                        setComputerMove({ 
                            from: move.from as Square, 
                            to: move.to as Square,
                            promotion: move.promotion 
                        });
                    } else {
                        setIsComputerThinking(false);
                    }
                 });
             }, delay);
        }
    }, [fen, gameMode, computerColor, difficulty, engineDifficulties, currentMoveIndex, history.length, isSpectatorModePaused, isGameStarting, isComputerThinking, playStyle, enginePlayStyles]);
  
  const resetGame = useCallback((isChess960 = false, handicap?: HandicapSettings, newComputerColor?: 'w' | 'b' | null) => {
    moveRequestCounter.current++;
    let startFen = isChess960 ? generateChess960Fen() : INITIAL_FEN;
    
    const effectiveComputerColor = newComputerColor !== undefined ? newComputerColor : computerColor;

    if (handicap && effectiveComputerColor) {
        startFen = applyHandicapToFen(startFen, handicap, effectiveComputerColor);
    }

    setInitialFen(startFen);
    setFen(startFen);
    setHistory([]);
    setCurrentMoveIndex(0);
    setLastMove(null);
    setGameOverData(null);
    setComputerMove(null);
    setIsComputerThinking(false);
    setLiveBestMove(null);
    setHintMove(null);
    if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
    }
    calculateCapturedAndAdvantage(startFen, startFen);
  }, [calculateCapturedAndAdvantage, computerColor]);

  const navigateToMove = useCallback((index: number) => {
      const newGame = new Chess(initialFen); // Start from the unique initial position
      const targetIndex = Math.max(0, Math.min(history.length, index));

      for(let i = 0; i < targetIndex; i++){
          newGame.move(history[i]);
      }
      
      setFen(newGame.fen());
      setCurrentMoveIndex(targetIndex);
      const lastMoveInHistory = targetIndex > 0 ? history[targetIndex - 1] : null;
      setLastMove(lastMoveInHistory ? { from: lastMoveInHistory.from, to: lastMoveInHistory.to } : null);
      
      calculateCapturedAndAdvantage(newGame.fen(), initialFen);

  }, [history, calculateCapturedAndAdvantage, initialFen]);

  const undoMove = useCallback(() => {
    if (currentMoveIndex > 0) {
      moveRequestCounter.current++; 
      setIsComputerThinking(false);  
      setComputerMove(null);         

      let movesToUndo = 1;
      
      if (gameMode === 'pvc' && computerColor && currentMoveIndex === history.length && game.turn() !== computerColor) {
        movesToUndo = 2;
      }
  
      const targetIndex = Math.max(0, currentMoveIndex - movesToUndo);
      navigateToMove(targetIndex);
      setHistory(prev => prev.slice(0, targetIndex));
      setGameOverData(null); 
    }
  }, [currentMoveIndex, history, gameMode, game, computerColor, navigateToMove]);

  const getLegalMoves = useCallback((square: Square) => {
    return new Chess(fen).moves({ square, verbose: true });
  }, [fen]);

  const requestHint = useCallback(async () => {
    const bestMove = await findComputerMove(new Chess(fen), 3200, 'balanced'); 
    if(bestMove){
        if (hintTimeoutRef.current) {
            clearTimeout(hintTimeoutRef.current);
        }

        setHintMove({ from: bestMove.from as Square, to: bestMove.to as Square });
        
        hintTimeoutRef.current = setTimeout(() => {
            setHintMove(null);
            hintTimeoutRef.current = null;
        }, 2500); 
    }
  }, [fen]);

  const loadPgn = useCallback((pgn: string) => {
    const gameForParsing = new Chess();
    const sanitizedPgn = pgn.replace(/\\n/g, '\n');

    try {
      gameForParsing.loadPgn(sanitizedPgn);
    } catch (e) {
      console.error("PGN parsing error:", e);
      return { success: false, headers: null, history: null };
    }

    const pgnHistory = gameForParsing.history({ verbose: true });

    if (pgnHistory.length === 0) {
      console.error("PGN parsing error: chess.js returned false and no history was parsed.");
      return { success: false, headers: null, history: null };
    }

    const headers = gameForParsing.header();

    const startFen = headers.FEN || INITIAL_FEN;
    setInitialFen(startFen);

    // Re-create the game from the true start FEN and replay moves to ensure a clean state.
    // This is more robust than trusting the final state of the mutated gameForParsing object.
    const finalGame = new Chess(startFen);
    for(const move of pgnHistory) {
        finalGame.move(move);
    }
    
    setGame(finalGame);
    setFen(finalGame.fen());
    setHistory(pgnHistory);
    setCurrentMoveIndex(pgnHistory.length);
    const lastMoveInHistory = pgnHistory.length > 0 ? pgnHistory[pgnHistory.length - 1] : null;
    setLastMove(lastMoveInHistory ? { from: lastMoveInHistory.from, to: lastMoveInHistory.to } : null);
    
    calculateCapturedAndAdvantage(finalGame.fen(), startFen);

    const result = headers.Result;
    if (result === '1-0') {
      setGameOverData({ winner: 'w', reason: 'result' });
    } else if (result === '0-1') {
      setGameOverData({ winner: 'b', reason: 'result' });
    } else if (result === '1/2-1/2') {
      setGameOverData({ winner: 'draw', reason: 'draw' });
    } else if (finalGame.isGameOver()) {
      if (finalGame.isCheckmate()) {
        setGameOverData({ winner: finalGame.turn() === 'b' ? 'w' : 'b', reason: 'checkmate' });
      } else {
        setGameOverData({ winner: 'draw', reason: 'draw' });
      }
    } else {
      setGameOverData(null);
    }

    return { success: true, headers, history: pgnHistory };
  }, [calculateCapturedAndAdvantage]);

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
    initialFen,
    loadPgn,
    computerMove,
    liveBestMove
  };
};