

import React, { useState, useCallback, useEffect } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { OpponentInfo } from './components/OpponentInfo';
import { EvaluationBar } from './components/EvaluationBar';
import { MoveHistory } from './components/MoveHistory';
import { Controls, ControlAction } from './components/Controls';
import { useChessGame } from './hooks/useChessGame';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { SettingsPanel } from './components/SettingsPanel';
import { PlayerInfo } from './components/PlayerInfo';
import { MatchStartAnimation } from './components/MatchStartAnimation';
import { GameOverModal } from './components/GameOverModal';
import { LandingScreen } from './components/LandingScreen';
import { NameInputModal } from './components/NameInputModal';
import { ExitConfirmationModal } from './components/ExitConfirmationModal';
import { CustomTimeModal } from './components/CustomTimeModal';
import { GameOverData } from './types';
import { AboutModal } from './components/AboutModal';
import { Icons } from './components/Icons';
import { findBestMove } from './services/chessEngine';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'landing' | 'playing'>('landing');
  const [gameMode, setGameMode] = useState<'pvc' | 'pvp'>('pvc');
  const [playerNames, setPlayerNames] = useState({ player1: 'Player', player2: 'Computer' });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState<'pvc' | 'pvp' | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isCustomTimeModalOpen, setIsCustomTimeModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showStartAnimation, setShowStartAnimation] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  // Analysis Mode
  const [analysisMode, setAnalysisMode] = useState(false);
  const [analysisBestMove, setAnalysisBestMove] = useState<string | null>(null);

  // Settings State
  const [showEvaluationBar, setShowEvaluationBar] = useState(true);
  const [showMoveFeedback, setShowMoveFeedback] = useState(true);
  const [enableHints, setEnableHints] = useState(true);
  const [enablePieceRotation, setEnablePieceRotation] = useState(false);
  const [timeControl, setTimeControl] = useState<'none' | '10min' | 'custom'>('none');
  const [customTimes, setCustomTimes] = useState({ p1: 5, p2: 5 }); // Default 5 minutes for custom

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
  } = useChessGame(gameMode);


  // Timer State
  const [player1Time, setPlayer1Time] = useState<number | null>(null);
  const [player2Time, setPlayer2Time] = useState<number | null>(null);

  const restartGameWithNewTimes = useCallback((p1Time: number | null, p2Time: number | null) => {
    resetGame();
    setAnalysisMode(false);
    setPlayer1Time(p1Time);
    setPlayer2Time(p2Time);
    setShowStartAnimation(false);
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
      const timer = setTimeout(() => {
        setIsGameOverModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameOverData]);

  // Calculate best move for analysis mode
  useEffect(() => {
      if (analysisMode) {
          findBestMove(game).then(move => {
              if (move) {
                  setAnalysisBestMove(move.san);
              } else {
                  setAnalysisBestMove(null);
              }
          });
      }
  }, [analysisMode, game]);

  const handleSelectMode = (mode: 'pvc' | 'pvp') => {
    setPendingGameMode(mode);
    setIsNameModalOpen(true);
  };
  
  const handleStartGame = (names: { player1: string; player2: string }) => {
    resetGame();
    setAnalysisMode(false);
    setPlayerNames(names);
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
    setGameState('playing');
    setShowStartAnimation(true);
  };

  const handleCloseNameModal = () => {
    setIsNameModalOpen(false);
    setPendingGameMode(null);
  };

  const handleRetry = () => {
    setIsGameOverModalOpen(false);
    const p1Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p1 * 60 : null;
    const p2Time = timeControl === '10min' ? 600 : timeControl === 'custom' ? customTimes.p2 * 60 : null;
    restartGameWithNewTimes(p1Time, p2Time);
  };

  const handleCloseModal = () => {
    setIsGameOverModalOpen(false);
  };
  
  const handleAnalyse = () => {
    setIsGameOverModalOpen(false);
    setAnalysisMode(true);
  };

  const handleRequestExit = () => {
    setIsExitModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    resetGame();
    setAnalysisMode(false);
    setGameState('landing');
  };

  const handleCancelExit = () => {
    setIsExitModalOpen(false);
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
    }
  }, [undoMove, requestHint]);

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

      {gameState === 'playing' && (
        <>
          {showStartAnimation && <MatchStartAnimation onAnimationEnd={() => setShowStartAnimation(false)} player1Name={playerNames.player1} player2Name={playerNames.player2} gameMode={gameMode} />}
          <div className={`w-full h-full flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-8 lg:p-4 transition-opacity duration-500 ${showStartAnimation ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* === MAIN GAME (Left Column on LG) === */}
            <div className="flex flex-col flex-grow lg:flex-grow-0 lg:w-auto lg:h-full lg:max-h-[95vh] lg:max-w-[95vh]">
                
                {/* Mobile Header */}
                <div className="lg:hidden">
                    <Header onBack={handleRequestExit}/>
                </div>

                {/* Mobile Eval/Analysis */}
                <div className="px-2 pt-1 max-w-md mx-auto w-full lg:hidden">
                    {showEvaluationBar ? <EvaluationBar evaluation={evaluation} isLoading={isComputerThinking} /> : <div className="h-3" />}
                    {showMoveFeedback ? (
                        <AnalysisDisplay 
                            move={history[currentMoveIndex - 1]}
                            moveIndex={currentMoveIndex}
                            analysisMode={analysisMode}
                            bestMoveSan={analysisBestMove}
                        />
                    ) : (
                        <div className="h-10" />
                    )}
                </div>

                {/* Board and Player Info (All Screens) */}
                <main className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full lg:flex-grow lg:w-full lg:max-w-none">
                    <OpponentInfo 
                        capturedPieces={capturedPieces.w} 
                        materialAdvantage={materialAdvantage}
                        playerName={playerNames.player2}
                        isComputer={gameMode === 'pvc'}
                        timeInSeconds={player2Time}
                        isTurn={game.turn() === 'b'}
                    />
                    <Board
                        fen={fen}
                        onMove={makeMove}
                        turn={game.turn()}
                        lastMove={lastMove}
                        getLegalMoves={getLegalMoves}
                        enablePieceRotation={enablePieceRotation}
                        hintMove={hintMove}
                        isInteractionDisabled={isComputerThinking || (!!gameOverData && !analysisMode)}
                        analysisMode={analysisMode}
                        currentMoveIndex={currentMoveIndex}
                        historyLength={history.length}
                        onRequestNavigation={navigateToMove}
                    />
                    <PlayerInfo 
                        capturedPieces={capturedPieces.b} 
                        materialAdvantage={materialAdvantage}
                        playerName={playerNames.player1}
                        timeInSeconds={player1Time}
                        isTurn={game.turn() === 'w'}
                    />
                </main>
                
                {/* Mobile Move History & Controls */}
                <div className="lg:hidden">
                    <MoveHistory
                        history={history}
                        currentMoveIndex={currentMoveIndex}
                        onNavigate={navigateToMove}
                    />
                    <Controls onControlClick={handleControlClick} isHintEnabled={enableHints && !analysisMode} />
                </div>
            </div>

            {/* === SIDEBAR (Right Column on LG) === */}
            <div className="hidden lg:flex flex-col w-[360px] h-full max-h-[95vh] shrink-0">
                <div className="flex justify-between items-center p-3 bg-[#18181a] rounded-t-lg">
                    <span className="text-xl font-semibold text-zinc-200">Chess</span>
                    <button onClick={handleRequestExit} aria-label="Back to menu" className="text-zinc-400 hover:text-white transition-colors flex items-center p-1 rounded-md hover:bg-zinc-700">
                        <Icons.ArrowLeft className="w-5 h-5" />
                        <span className="ml-1.5 text-sm font-medium">Exit Game</span>
                    </button>
                </div>

                <div className="p-3 bg-[#18181a]">
                    {showEvaluationBar ? <EvaluationBar evaluation={evaluation} isLoading={isComputerThinking} /> : <div className="h-3" />}
                    {showMoveFeedback ? (
                        <AnalysisDisplay 
                            move={history[currentMoveIndex - 1]}
                            moveIndex={currentMoveIndex}
                            analysisMode={analysisMode}
                            bestMoveSan={analysisBestMove}
                        />
                    ) : (
                        <div className="h-10" />
                    )}
                </div>

                <div className="flex-grow bg-[#18181a] overflow-hidden">
                    <MoveHistory
                        history={history}
                        currentMoveIndex={currentMoveIndex}
                        onNavigate={navigateToMove}
                    />
                </div>
                
                <div className="bg-[#18181a] rounded-b-lg">
                    <Controls onControlClick={handleControlClick} isHintEnabled={enableHints && !analysisMode} />
                </div>
            </div>

            {/* Modals are outside the layout flow, which is correct */}
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
            />
            {gameOverData && (
              <GameOverModal 
                isOpen={isGameOverModalOpen}
                winner={gameOverData.winner}
                reason={gameOverData.reason as string}
                onRetry={handleRetry}
                onAnalyse={handleAnalyse}
                onClose={handleCloseModal}
                player1Name={playerNames.player1}
                player2Name={playerNames.player2}
              />
            )}
             <ExitConfirmationModal
              isOpen={isExitModalOpen}
              onConfirm={handleConfirmExit}
              onCancel={handleCancelExit}
            />
            <CustomTimeModal
              isOpen={isCustomTimeModalOpen}
              onClose={() => setIsCustomTimeModalOpen(false)}
              onSetTime={handleSetCustomTime}
              initialP1={customTimes.p1}
              initialP2={customTimes.p2}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;