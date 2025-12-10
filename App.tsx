
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Controls } from './components/Controls';
import { useChessGame } from './hooks/useChessGame';
import { SettingsPanel } from './components/SettingsPanel';
import { MatchStartAnimation } from './components/MatchStartAnimation';
import { GameOverModal } from './components/GameOverModal';
import { GameReviewModal } from './components/GameReviewModal';
import { LandingScreen } from './components/LandingScreen';
import { NameInputModal } from './components/NameInputModal';
import { ExitConfirmationModal } from './components/ExitConfirmationModal';
import { ResignConfirmationModal } from './components/ResignConfirmationModal';
import { AboutModal } from './components/AboutModal';
import { AnalysisLoadingModal } from './components/AnalysisLoadingModal';
import { analyzeGame } from './services/analysisService';
import { useViewport } from './hooks/useViewport';
import { PortraitLayout } from './components/PortraitLayout';
import { LandscapeLayout } from './components/LandscapeLayout';
import { LayoutProps, ControlAction, Difficulty, GameAnalysis, getDifficultyDetails, HandicapSettings, PlayStyle } from './types';
import { AnalyzeGameModal } from './components/AnalyzeGameModal';
import { Chess, Move } from 'chess.js';
import { SpectatorPanel } from './components/SpectatorPanel';
import { playSound } from './services/soundManager';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (isOnline) return;

    const handleOnline = () => {
       // Detected connection recovery. Reload to fetch Tailwind/Fonts.
       window.location.reload();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isOnline]);

  if (!isOnline) {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#121212',
            color: '#e4e4e7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: '#27272a',
                padding: '1.5rem',
                borderRadius: '9999px',
                marginBottom: '1.5rem',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: '#fff', letterSpacing: '-0.025em' }}>Connection Required</h1>
            <p style={{ color: '#a1a1aa', marginBottom: '2.5rem', maxWidth: '20rem', lineHeight: '1.5' }}>
                SiChess requires an internet connection to load essential resources.
            </p>
            <button 
                onClick={() => window.location.reload()}
                style={{
                    backgroundColor: '#0284c7',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 2.5rem',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            >
                Retry Connection
            </button>
        </div>
    );
  }

  const [gameState, setGameState] = useState<'landing' | 'playing'>('landing');
  const [gameMode, setGameMode] = useState<'pvc' | 'pvp' | 'cvc'>('pvc');
  const [difficulty, setDifficulty] = useState<Difficulty>(1200);
  const [engineDifficulties, setEngineDifficulties] = useState({ white: 1200, black: 1200 });
  const [playerNames, setPlayerNames] = useState({ player1: 'Player', player2: 'Computer' });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState<'pvc' | 'pvp' | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [playStyle, setPlayStyle] = useState<PlayStyle>('balanced');
  const [enginePlayStyles, setEnginePlayStyles] = useState<{ white: PlayStyle; black: PlayStyle }>({ white: 'balanced', black: 'balanced' });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isGameReviewModalOpen, setIsGameReviewModalOpen] = useState(false);
  const [isPostGame, setIsPostGame] = useState(false);
  const [isAnalyzeGameModalOpen, setIsAnalyzeGameModalOpen] = useState(false);
  const [isSpectatorPanelOpen, setIsSpectatorPanelOpen] = useState(false);
  const [isSpectatorModePaused, setIsSpectatorModePaused] = useState(false);
  const [isGameStarting, setIsGameStarting] = useState(false);


  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');

  const [analysisMode, setAnalysisMode] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<GameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const [showEvaluationBar, setShowEvaluationBar] = useState(true);
  const [showMoveFeedback, setShowMoveFeedback] = useState(true);
  const [enableHints, setEnableHints] = useState(true);
  const [enablePieceRotation, setEnablePieceRotation] = useState(false);
  const [enableTakebacks, setEnableTakebacks] = useState(true);
  const [isChess960, setIsChess960] = useState(false);
  const [timeControl, setTimeControl] = useState<'none' | '10min' | 'custom'>('none');
  const [customTimes, setCustomTimes] = useState({ p1: 5, p2: 5 }); // Default 5 minutes for custom
  const [handicapSettings, setHandicapSettings] = useState<HandicapSettings>({ queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 });

  const isPgnAnalysisFlow = useRef(false);

  const computerColor = gameMode === 'pvc' ? (playerColor === 'w' ? 'b' : 'w') : null;

  const {
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
    liveBestMove,
  } = useChessGame(gameMode, computerColor, difficulty, engineDifficulties, isSpectatorModePaused, isGameStarting, playStyle, enginePlayStyles);

  const { isLandscape } = useViewport();

  const [player1Time, setPlayer1Time] = useState<number | null>(null);
  const [player2Time, setPlayer2Time] = useState<number | null>(null);

  const restartGameWithNewTimes = useCallback((p1Time: number | null, p2Time: number | null) => {
    // For retry, we don't re-apply handicap. It's only for new games from setup.
    resetGame(isChess960);
    setAnalysisMode(false);
    setAnalysisResults(null);
    setPlayer1Time(p1Time);
    setPlayer2Time(p2Time);
    setShowStartAnimation(false);
    setIsPostGame(false);
    playSound('gameStart');
  }, [resetGame, isChess960]);

  const handleCustomTimeChange = (p1Minutes: number, p2Minutes: number) => {
    const validP1 = !isNaN(p1Minutes) && p1Minutes > 0 ? Math.min(p1Minutes, 99) : 1;
    const validP2 = !isNaN(p2Minutes) && p2Minutes > 0 ? Math.min(p2Minutes, 99) : 1;
    setCustomTimes({ p1: validP1, p2: validP2 });
  };

  // Timer countdown effect
  useEffect(() => {
    if (gameState !== 'playing' || gameOverData || showStartAnimation || isSettingsOpen || analysisMode || isSpectatorModePaused || isGameStarting) {
      return;
    }

    const timer = setInterval(() => {
      if (game.turn() === 'w') {
        setPlayer1Time(t => (t !== null && t > 0 ? t - 1 : t));
      } else {
        setPlayer2Time(t => (t !== null && t > 0 ? t - 1 : t));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, game, gameOverData, showStartAnimation, isSettingsOpen, analysisMode, isSpectatorModePaused, isGameStarting]);

  // Check for timeout effect
  useEffect(() => {
    if (player1Time === 0) {
      setGameOverData({ winner: 'b', reason: 'timeout' });
      setPlayer1Time(null);
      setPlayer2Time(null);
    } else if (player2Time === 0) {
      setGameOverData({ winner: 'w', reason: 'timeout' });
      setPlayer1Time(null);
      setPlayer2Time(null);
    }
  }, [player1Time, player2Time, setGameOverData]);


  useEffect(() => {
    if (gameOverData && !isPgnAnalysisFlow.current) {
      setAnalysisMode(false);
      setIsPostGame(false);
      const timer = setTimeout(() => {
        setIsGameOverModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameOverData]);

  const handleSelectMode = (mode: 'pvc' | 'pvp') => {
    setPendingGameMode(mode);
  };

  useEffect(() => {
    if (pendingGameMode) {
      const timer = setTimeout(() => setIsNameModalOpen(true), 50);
      return () => clearTimeout(timer);
    }
  }, [pendingGameMode]);
  
  const handleStartGame = (
    names: { player1: string; player2: string },
    options: {
        colorPref?: 'w' | 'b' | 'random',
        selectedDifficulty?: Difficulty,
        isHandicap?: boolean,
        handicapConfig?: HandicapSettings,
        playStyle?: PlayStyle
    }
  ) => {
    const { colorPref, selectedDifficulty, isHandicap, handicapConfig, playStyle: selectedPlayStyle } = options;

    let finalPlayerColor: 'w' | 'b';

    if (pendingGameMode === 'pvc' && colorPref) {
      if (colorPref === 'random') {
        finalPlayerColor = Math.random() > 0.5 ? 'w' : 'b';
      } else {
        finalPlayerColor = colorPref;
      }
    } else { // pvp
      finalPlayerColor = 'w';
    }
    
    // This state update triggers a re-render, which gives useChessGame the new computerColor
    setPlayerColor(finalPlayerColor); 
    
    let finalDifficulty = selectedDifficulty || 1200;
    if (isHandicap) {
        finalDifficulty = 3200; // Force max difficulty (Ultimate) for handicap games
    }
    setDifficulty(finalDifficulty);
    setPlayStyle(selectedPlayStyle || 'balanced');

    // Calculate the new computer color to avoid using stale state from the hook
    const newComputerColor = pendingGameMode === 'pvc' ? (finalPlayerColor === 'w' ? 'b' : 'w') : null;

    // Call resetGame with handicap settings if applicable, passing the correct computer color.
    resetGame(isChess960, isHandicap ? handicapConfig : undefined, newComputerColor);
    
    setAnalysisMode(false);
    setAnalysisResults(null);

    if (pendingGameMode === 'pvc') {
      const details = getDifficultyDetails(finalDifficulty);
      const computerName = `${details.label} ${details.elo}`;
      setPlayerNames({ player1: names.player1, player2: computerName });
    } else { // pvp
      setPlayerNames(names);
    }
    
    if (timeControl === '10min') {
        setPlayer1Time(600);
        setPlayer2Time(600);
    } else if (timeControl === 'custom') {
        setPlayer1Time(customTimes.p1 * 60);
        setPlayer2Time(customTimes.p2 * 60);
    } else {
        setPlayer1Time(null);
        setPlayer2Time(null);
    }
    setGameMode(pendingGameMode!);
    setIsPostGame(false);
    setIsGameStarting(true);

    setIsNameModalOpen(false); // Trigger close animation

    setTimeout(() => {
      setPendingGameMode(null); // Unmount after animation
      setGameState('playing');
      setShowStartAnimation(true);
      // Sound played in handleAnimationEnd
    }, 300); // Wait for animation
  };

  const handleStartSpectatorGame = (settings: {
    whiteDifficulty: Difficulty;
    blackDifficulty: Difficulty;
    whiteStyle: PlayStyle;
    blackStyle: PlayStyle;
    timeControl: 'none' | '10min' | 'custom';
    customTimes: { p1: number, p2: number };
    showEvaluationBar: boolean;
    enableTakebacks: boolean;
    isChess960: boolean;
  }) => {
    setGameMode('cvc');
    setPlayerColor('w'); // Spectator view is from white's perspective
    setEngineDifficulties({ white: settings.whiteDifficulty, black: settings.blackDifficulty });
    setEnginePlayStyles({ white: settings.whiteStyle, black: settings.blackStyle });
    
    const whiteDetails = getDifficultyDetails(settings.whiteDifficulty);
    const blackDetails = getDifficultyDetails(settings.blackDifficulty);
    setPlayerNames({
      player1: `${whiteDetails.label} ${whiteDetails.elo}`,
      player2: `${blackDetails.label} ${blackDetails.elo}`
    });

    // Apply shared settings
    setShowEvaluationBar(settings.showEvaluationBar);
    setEnableTakebacks(settings.enableTakebacks);
    setIsChess960(settings.isChess960);
    setTimeControl(settings.timeControl);
    setCustomTimes(settings.customTimes);
    // playStyle state is used for PVC, enginePlayStyles for CVC. 
    // We set playStyle to 'balanced' just to keep it clean, though it won't be used in CVC.
    setPlayStyle('balanced'); 

    // Reset game and timers
    resetGame(settings.isChess960);
    setAnalysisMode(false);
    setAnalysisResults(null);
    setIsSpectatorModePaused(false);

    if (settings.timeControl === '10min') {
        setPlayer1Time(600);
        setPlayer2Time(600);
    } else if (settings.timeControl === 'custom') {
        setPlayer1Time(settings.customTimes.p1 * 60);
        setPlayer2Time(settings.customTimes.p2 * 60);
    } else {
        setPlayer1Time(null);
        setPlayer2Time(null);
    }
    
    setIsPostGame(false);
    setIsSpectatorPanelOpen(false); // Close panel
    setGameState('playing');
    setIsGameStarting(true);
    setShowStartAnimation(true);
    // Sound played in handleAnimationEnd
  };

  const handleCloseNameModal = () => {
    setIsNameModalOpen(false);
    setTimeout(() => {
      setPendingGameMode(null);
    }, 300);
  };

  const handleRetry = () => {
    setIsGameOverModalOpen(false);
    setIsPostGame(false);
    if (gameMode === 'cvc') {
      setIsSpectatorModePaused(false);
    }
    const p1Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p1 * 60 : null;
    const p2Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p2 * 60 : null;
    restartGameWithNewTimes(p1Time, p2Time);
  };

  const handleCloseModal = () => {
    setIsGameOverModalOpen(false);
    setIsPostGame(true);
  };
  
  const handleAnalyze = useCallback(async (gameHistory: Move[], startFenOverride?: string) => {
    setIsGameOverModalOpen(false);
    setIsPostGame(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const fenToAnalyze = startFenOverride || initialFen;
    const results = await analyzeGame(gameHistory, fenToAnalyze, (progress) => {
        setAnalysisProgress(progress);
    });
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setIsGameReviewModalOpen(true);
  }, [initialFen]);

  const handleStartPgnAnalysis = useCallback(async (pgn: string): Promise<boolean> => {
    isPgnAnalysisFlow.current = true;

    try {
      // Explicitly reset the game to a clean slate before loading a PGN.
      // This ensures no state from a previously quit game (like a spectator match) persists.
      resetGame();

      const { success, headers, history: pgnHistory } = loadPgn(pgn);

      if (!success || !pgnHistory || pgnHistory.length === 0) {
        // PGN is invalid, return false to the modal
        return false;
      }

      // PGN is valid, close the modal and start the analysis flow.
      setIsAnalyzeGameModalOpen(false);

      // Extract player names from PGN headers, defaulting if they are missing or placeholders.
      const whitePlayer = headers?.White && headers.White !== '?' ? headers.White : 'White';
      const blackPlayer = headers?.Black && headers.Black !== '?' ? headers.Black : 'Black';

      setPlayerNames({
        player1: whitePlayer,
        player2: blackPlayer,
      });
      setPlayerColor('w'); // Default to white's perspective
      setGameState('playing');
      setGameMode('pvp');

      const startFen = headers?.FEN || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      // Manually trigger the analysis flow
      await handleAnalyze(pgnHistory, startFen);
      return true;
    } finally {
      isPgnAnalysisFlow.current = false;
    }
  }, [loadPgn, handleAnalyze, resetGame]);


  const handleContinueReview = () => {
    setIsGameReviewModalOpen(false);
    setAnalysisMode(true);
    // Important: Reset isAnalyzing to false here just in case, though it should be set by handleAnalyze completion.
    // However, the issue described was about AnalysisLoadingModal being open.
    // The previous fix added setIsAnalyzing(false) in handleAnalyze. 
    // This is just navigation.
    navigateToMove(0);
  };

  const handleCloseReview = () => {
    setIsGameReviewModalOpen(false);
    setAnalysisMode(false); // Ensure analysis mode is off so GameOverModal can show
    setIsGameOverModalOpen(true);
  }

  const handleRequestExit = () => {
    if (analysisMode) {
      setIsGameReviewModalOpen(true);
    } else {
      setIsExitModalOpen(true);
    }
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    resetGame();
    setAnalysisMode(false);
    setAnalysisResults(null);
    setIsPostGame(false);
    setIsChess960(false);
    setIsSpectatorModePaused(false);
    setIsGameStarting(false);
    setGameState('landing');
  };

  const handleCancelExit = () => {
    setIsExitModalOpen(false);
  };

  const handleConfirmResign = () => {
    setIsResignModalOpen(false);
    if (gameMode === 'pvc') {
        // Computer wins
        const winner = playerColor === 'w' ? 'b' : 'w';
        playSound('gameEnd');
        setGameOverData({ winner, reason: 'resignation' });
    }
  };

  const handleCancelResign = () => {
      setIsResignModalOpen(false);
  };

  const handleAnimationEnd = useCallback(() => {
    playSound('gameStart');
    setShowStartAnimation(false);
    // For CVC mode, wait 3 seconds. For other modes (like PVC), wait for the
    // board's fade-in animation (500ms) to complete before allowing the game
    // to start. This prevents the computer from thinking while the board is still
    // transitioning into view.
    const delay = gameMode === 'cvc' ? 3000 : 500;
    setTimeout(() => {
      setIsGameStarting(false);
    }, delay);
  }, [gameMode]);


  const handleControlClick = useCallback((action: ControlAction) => {
    switch (action) {
      case 'settings':
        setIsSettingsOpen(true);
        break;
      case 'hint':
        requestHint();
        break;
      case 'undo':
        undoMove();
        break;
      case 'resign':
        setIsResignModalOpen(true);
        break;
      case 'analyze':
        handleAnalyze(history);
        break;
      case 'togglePause':
        setIsSpectatorModePaused(p => !p);
        break;
    }
  }, [undoMove, requestHint, handleAnalyze, history]);

  const currentAnalysis = analysisMode && analysisResults ? analysisResults.details[currentMoveIndex] : null;
  
  // Only show live feedback if enabled, not analyzing, at the latest move, and data exists
  const isAtLatestMove = currentMoveIndex === history.length;
  const showLiveFeedback = showMoveFeedback && !analysisMode && isAtLatestMove && liveBestMove;

  const layoutProps: LayoutProps = {
    game, fen, history, makeMove, navigateToMove, currentMoveIndex, lastMove, getLegalMoves,
    capturedPieces, materialAdvantage, gameOverData, evaluation, isComputerThinking,
    hintMove, gameMode, playerNames, player1Time, player2Time, handleRequestExit,
    showEvaluationBar, showMoveFeedback, analysisMode, 
    analysisResults: analysisResults ? analysisResults.details : null,
    analysisBestMoveForPosition: analysisMode 
        ? (currentAnalysis?.bestMove || null)
        : (showLiveFeedback ? liveBestMove : null),
    currentMoveAnalysis: currentAnalysis,
    enableHints, 
    enablePieceRotation: gameMode === 'pvp' && enablePieceRotation, // Only enable piece rotation in PvP
    handleControlClick, 
    playerColor,
    isPostGame,
    difficulty,
    enableTakebacks,
    engineDifficulties,
    isSpectatorModePaused,
    computerMove,
    playStyle: gameMode === 'pvc' ? playStyle : 'balanced',
    enginePlayStyles: gameMode === 'cvc' ? enginePlayStyles : undefined,
  };

  return (
    <div className="bg-[#121212] text-zinc-200 h-screen w-screen flex flex-col font-['Inter'] select-none relative overflow-hidden">
      {gameState === 'landing' && (
        <>
            <LandingScreen 
              onSelectMode={handleSelectMode} 
              onShowAbout={() => setIsAboutModalOpen(true)}
              onAnalyze={() => setIsAnalyzeGameModalOpen(true)}
              onSpectate={() => setIsSpectatorPanelOpen(true)}
            />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            <AnalyzeGameModal 
              isOpen={isAnalyzeGameModalOpen}
              onClose={() => setIsAnalyzeGameModalOpen(false)}
              onAnalyze={handleStartPgnAnalysis}
            />
            <SpectatorPanel 
              isOpen={isSpectatorPanelOpen}
              onClose={() => setIsSpectatorPanelOpen(false)}
              onStartBattle={handleStartSpectatorGame}
            />
        </>
      )}

      {pendingGameMode && (
        <NameInputModal
          isOpen={isNameModalOpen}
          mode={pendingGameMode}
          onStart={handleStartGame}
          onClose={handleCloseNameModal}
          timeControl={timeControl}
          onTimeControlChange={setTimeControl}
          customTimes={customTimes}
          onCustomTimeChange={handleCustomTimeChange}
          showEvaluationBar={showEvaluationBar}
          onToggleEvaluationBar={() => setShowEvaluationBar(p => !p)}
          showMoveFeedback={showMoveFeedback}
          onToggleMoveFeedback={() => setShowMoveFeedback(p => !p)}
          enableHints={enableHints}
          onToggleHints={() => setEnableHints(p => !p)}
          enableTakebacks={enableTakebacks}
          onToggleTakebacks={() => setEnableTakebacks(p => !p)}
          enablePieceRotation={enablePieceRotation}
          onTogglePieceRotation={() => setEnablePieceRotation(p => !p)}
          enableChess960={isChess960}
          onToggleChess960={() => setIsChess960(p => !p)}
          handicapSettings={handicapSettings}
          onHandicapSettingsChange={setHandicapSettings}
        />
      )}
      
      <AnalysisLoadingModal isOpen={isAnalyzing} progress={analysisProgress} />
      
      {analysisResults && (
        <GameReviewModal 
            isOpen={isGameReviewModalOpen}
            onClose={handleCloseReview}
            onContinue={handleContinueReview}
            summary={analysisResults.summary}
            analysisDetails={analysisResults.details}
            playerNames={playerNames}
            winner={gameOverData?.winner}
            gameMode={gameMode}
            difficulty={difficulty}
            playerColor={playerColor}
        />
      )}

      {gameState === 'playing' && (
        <>
          {showStartAnimation && <MatchStartAnimation onAnimationEnd={handleAnimationEnd} player1Name={playerNames.player1} player2Name={playerNames.player2} gameMode={gameMode} difficulty={difficulty} />}
          
          <div className={`w-full h-full transition-opacity duration-500 ${showStartAnimation ? 'opacity-0' : 'opacity-100'}`}>
            {isLandscape ? <LandscapeLayout {...layoutProps} /> : <PortraitLayout {...layoutProps} />}
          </div>
            
          <SettingsPanel
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              showEvaluationBar={showEvaluationBar}
              onToggleEvaluationBar={() => setShowEvaluationBar(prev => !prev)}
              showMoveFeedback={showMoveFeedback}
              onToggleMoveFeedback={() => setShowMoveFeedback(prev => !prev)}
              enableHints={enableHints}
              onToggleHints={() => setEnableHints(prev => !prev)}
              enableTakebacks={enableTakebacks}
              onToggleTakebacks={() => setEnableTakebacks(prev => !prev)}
              enablePieceRotation={enablePieceRotation}
              onTogglePieceRotation={() => setEnablePieceRotation(prev => !prev)}
              gameMode={gameMode}
          />
          {gameOverData && !analysisMode && (
            <GameOverModal 
              isOpen={isGameOverModalOpen}
              winner={gameOverData.winner}
              reason={gameOverData.reason as string}
              onRetry={handleRetry}
              onAnalyze={() => handleAnalyze(history)}
              onClose={handleCloseModal}
              onExit={handleConfirmExit}
              player1Name={playerNames.player1}
              player2Name={playerNames.player2}
              playerColor={playerColor}
              gameMode={gameMode}
              history={history}
              timeControl={timeControl}
              customTimes={customTimes}
              initialFen={initialFen}
              isChess960={isChess960}
            />
          )}
           <ExitConfirmationModal
            isOpen={isExitModalOpen}
            onConfirm={handleConfirmExit}
            onCancel={handleCancelExit}
          />
          <ResignConfirmationModal
            isOpen={isResignModalOpen}
            onConfirm={handleConfirmResign}
            onCancel={handleCancelResign}
          />
        </>
      )}
    </div>
  );
};

export default App;
