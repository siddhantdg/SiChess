
import React, { useState, useCallback, useEffect } from 'react';
// FIX: `ControlAction` is not exported from './components/Controls'. It is now imported from './types' below.
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
import { CustomTimeModal } from './components/CustomTimeModal';
import { AboutModal } from './components/AboutModal';
import { AnalysisLoadingModal } from './components/AnalysisLoadingModal';
import { analyzeGame } from './services/analysisService';
import { useViewport } from './hooks/useViewport';
import { PortraitLayout } from './components/PortraitLayout';
import { LandscapeLayout } from './components/LandscapeLayout';
import { LayoutProps, ControlAction, Difficulty, GameAnalysis } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'landing' | 'playing'>('landing');
  const [gameMode, setGameMode] = useState<'pvc' | 'pvp'>('pvc');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [playerNames, setPlayerNames] = useState({ player1: 'Player', player2: 'Computer' });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState<'pvc' | 'pvp' | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [isCustomTimeModalOpen, setIsCustomTimeModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isGameReviewModalOpen, setIsGameReviewModalOpen] = useState(false);
  const [isPostGame, setIsPostGame] = useState(false);

  // Player's chosen color ('w' or 'b')
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');

  // Analysis Mode
  const [analysisMode, setAnalysisMode] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<GameAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Settings State
  const [showEvaluationBar, setShowEvaluationBar] = useState(true);
  const [showMoveFeedback, setShowMoveFeedback] = useState(true);
  const [enableHints, setEnableHints] = useState(true);
  const [enablePieceRotation, setEnablePieceRotation] = useState(false);
  const [timeControl, setTimeControl] = useState<'none' | '10min' | 'custom'>('none');
  const [customTimes, setCustomTimes] = useState({ p1: 5, p2: 5 }); // Default 5 minutes for custom

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
  } = useChessGame(gameMode, computerColor, difficulty);

  const { isLandscape } = useViewport();

  // Timer State
  const [player1Time, setPlayer1Time] = useState<number | null>(null);
  const [player2Time, setPlayer2Time] = useState<number | null>(null);

  const restartGameWithNewTimes = useCallback((p1Time: number | null, p2Time: number | null) => {
    resetGame();
    setAnalysisMode(false);
    setAnalysisResults(null);
    setPlayer1Time(p1Time);
    setPlayer2Time(p2Time);
    setShowStartAnimation(false);
    setIsPostGame(false);
  }, [resetGame]);

  const handleChangeTimeControl = (newMode: 'none' | '10min' | 'custom') => {
    setIsSettingsOpen(false);
    if (newMode === 'custom') {
      setIsCustomTimeModalOpen(true);
    } else {
      setTimeControl(newMode);
      const newTime = newMode === '10min' ? 600 : null;
      restartGameWithNewTimes(newTime, newTime);
    }
  };

  const handleSetCustomTime = (p1Minutes: number, p2Minutes: number) => {
    setIsCustomTimeModalOpen(false);
    setTimeControl('custom');
    setCustomTimes({ p1: p1Minutes, p2: p2Minutes });
    restartGameWithNewTimes(p1Minutes * 60, p2Minutes * 60);
  };

  // Timer countdown effect
  useEffect(() => {
    if (gameState !== 'playing' || gameOverData || showStartAnimation || isSettingsOpen || isCustomTimeModalOpen || analysisMode) {
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
  }, [gameState, game, gameOverData, showStartAnimation, isSettingsOpen, isCustomTimeModalOpen, analysisMode]);

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
    if (gameOverData) {
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
    setIsNameModalOpen(true);
  };
  
  const handleStartGame = (names: { player1: string; player2: string }, colorPref?: 'w' | 'b' | 'random', selectedDifficulty?: Difficulty) => {
    resetGame();
    setAnalysisMode(false);
    setAnalysisResults(null);
    setDifficulty(selectedDifficulty || 'intermediate');

    if (pendingGameMode === 'pvc' && colorPref) {
      let finalPlayerColor: 'w' | 'b';
      if (colorPref === 'random') {
        finalPlayerColor = Math.random() > 0.5 ? 'w' : 'b';
      } else {
        finalPlayerColor = colorPref;
      }
      setPlayerColor(finalPlayerColor);
      setPlayerNames({ player1: names.player1, player2: 'Computer' });
    } else { // pvp
      setPlayerColor('w');
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
    setIsNameModalOpen(false);
    setPendingGameMode(null);
    setIsPostGame(false);
    setGameState('playing');
    setShowStartAnimation(true);
  };

  const handleCloseNameModal = () => {
    setIsNameModalOpen(false);
    setPendingGameMode(null);
  };

  const handleRetry = () => {
    setIsGameOverModalOpen(false);
    setIsPostGame(false);
    const p1Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p1 * 60 : null;
    const p2Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p2 * 60 : null;
    restartGameWithNewTimes(p1Time, p2Time);
  };

  const handleCloseModal = () => {
    setIsGameOverModalOpen(false);
    setIsPostGame(true);
  };
  
  const handleAnalyse = useCallback(async () => {
    setIsGameOverModalOpen(false);
    setIsPostGame(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const results = await analyzeGame(history, (progress) => {
        setAnalysisProgress(progress);
    });
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setIsGameReviewModalOpen(true);
  }, [history]);

  const handleContinueReview = () => {
    setIsGameReviewModalOpen(false);
    setAnalysisMode(true);
    navigateToMove(0);
  };

  const handleCloseReview = () => {
    setIsGameReviewModalOpen(false);
    // Optionally go back to game over modal, or just stay on board
    setIsGameOverModalOpen(true);
  }

  const handleRequestExit = () => {
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    resetGame();
    setAnalysisMode(false);
    setAnalysisResults(null);
    setIsPostGame(false);
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
        setGameOverData({ winner, reason: 'resignation' });
    }
  };

  const handleCancelResign = () => {
      setIsResignModalOpen(false);
  };


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
      case 'analyse':
        handleAnalyse();
        break;
    }
  }, [undoMove, requestHint, handleAnalyse]);

  const currentAnalysis = analysisMode && analysisResults ? analysisResults.details[currentMoveIndex] : null;

  const layoutProps: LayoutProps = {
    game, fen, history, makeMove, navigateToMove, currentMoveIndex, lastMove, getLegalMoves,
    capturedPieces, materialAdvantage, gameOverData, evaluation, isComputerThinking,
    hintMove, gameMode, playerNames, player1Time, player2Time, handleRequestExit,
    showEvaluationBar, showMoveFeedback, analysisMode, 
    analysisResults: analysisResults ? analysisResults.details : null,
    analysisBestMoveForPosition: currentAnalysis?.bestMove || null,
    currentMoveAnalysis: currentAnalysis,
    enableHints, enablePieceRotation, handleControlClick, playerColor,
    isPostGame,
    difficulty,
  };

  return (
    <div className="bg-[#121212] text-zinc-200 h-screen w-screen flex flex-col font-['Inter'] select-none relative overflow-hidden">
      {gameState === 'landing' && (
        <>
            <LandingScreen onSelectMode={handleSelectMode} onShowAbout={() => setIsAboutModalOpen(true)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        </>
      )}

      {pendingGameMode && (
        <NameInputModal
          isOpen={isNameModalOpen}
          mode={pendingGameMode}
          onStart={handleStartGame}
          onClose={handleCloseNameModal}
        />
      )}
      
      <AnalysisLoadingModal isOpen={isAnalyzing} progress={analysisProgress} />
      
      {analysisResults && (
        <GameReviewModal 
            isOpen={isGameReviewModalOpen}
            onClose={handleCloseReview}
            onContinue={handleContinueReview}
            summary={analysisResults.summary}
            playerNames={playerNames}
            winner={gameOverData?.winner}
            gameMode={gameMode}
            difficulty={difficulty}
        />
      )}

      {gameState === 'playing' && (
        <>
          {showStartAnimation && <MatchStartAnimation onAnimationEnd={() => setShowStartAnimation(false)} player1Name={playerNames.player1} player2Name={playerNames.player2} gameMode={gameMode} difficulty={difficulty} />}
          
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
              enablePieceRotation={enablePieceRotation}
              onTogglePieceRotation={() => setEnablePieceRotation(prev => !prev)}
              timeControl={timeControl}
              onSetTimeControl={handleChangeTimeControl}
              gameMode={gameMode}
          />
          {gameOverData && !analysisMode && (
            <GameOverModal 
              isOpen={isGameOverModalOpen}
              winner={gameOverData.winner}
              reason={gameOverData.reason as string}
              onRetry={handleRetry}
              onAnalyse={handleAnalyse}
              onClose={handleCloseModal}
              player1Name={playerNames.player1}
              player2Name={playerNames.player2}
              playerColor={playerColor}
              gameMode={gameMode}
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
          <CustomTimeModal
            isOpen={isCustomTimeModalOpen}
            onClose={() => setIsCustomTimeModalOpen(false)}
            onSetTime={handleSetCustomTime}
            initialP1={customTimes.p1}
            initialP2={customTimes.p2}
          />
        </>
      )}
    </div>
  );
};

export default App;
