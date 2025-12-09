
import React from 'react';
import { Board } from './Board';
import { OpponentInfo } from './OpponentInfo';
import { EvaluationBar } from './EvaluationBar';
import { MoveHistory } from './MoveHistory';
import { Controls } from './Controls';
import { AnalysisDisplay } from './AnalysisDisplay';
import { PlayerInfo } from './PlayerInfo';
import { LayoutProps } from '../types';
import { Icons } from './Icons';

export const LandscapeLayout: React.FC<LayoutProps> = (props) => {
    const isPlayerWhite = props.playerColor === 'w';

    const opponentAdvantage = !isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);
    
    const playerAdvantage = isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);

    return (
        <div className="w-full h-screen flex flex-row bg-[#121212]">
            {/* LEFT PANEL: Gameplay Area (~60%) */}
            <div className="w-[60%] h-full flex justify-center items-center p-4">
                <div className="flex flex-col justify-center w-full h-full max-w-[90vh] max-h-[90vh]">
                    <OpponentInfo 
                        capturedPieces={isPlayerWhite ? props.capturedPieces.w : props.capturedPieces.b} 
                        materialAdvantage={opponentAdvantage}
                        playerName={props.playerNames.player2}
                        isComputer={props.gameMode === 'pvc'}
                        timeInSeconds={isPlayerWhite ? props.player2Time : props.player1Time}
                        isTurn={props.game.turn() !== props.playerColor}
                        difficulty={props.difficulty}
                    />
                    <div className="relative">
                        <Board
                            fen={props.fen}
                            onMove={props.makeMove}
                            turn={props.game.turn()}
                            lastMove={props.lastMove}
                            getLegalMoves={props.getLegalMoves}
                            enablePieceRotation={props.enablePieceRotation}
                            hintMove={props.hintMove}
                            isInteractionDisabled={props.isComputerThinking || (!!props.gameOverData && !props.analysisMode)}
                            analysisMode={props.analysisMode}
                            analysisBestMoveForPosition={props.analysisBestMoveForPosition}
                            currentMoveIndex={props.currentMoveIndex}
                            historyLength={props.history.length}
                            onRequestNavigation={props.navigateToMove}
                            playerColor={props.playerColor}
                        />
                    </div>
                    <PlayerInfo 
                        capturedPieces={isPlayerWhite ? props.capturedPieces.b : props.capturedPieces.w} 
                        materialAdvantage={playerAdvantage}
                        playerName={props.playerNames.player1}
                        timeInSeconds={isPlayerWhite ? props.player1Time : props.player2Time}
                        isTurn={props.game.turn() === props.playerColor}
                    />
                </div>
            </div>
            
         {/* RIGHT PANEL: Info & Controls (~40%) */}
            <div className="w-[40%] h-full flex flex-col bg-[#18181a] p-4">
                {/* Top Section */}
                <div className="shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-zinc-200 font-montserrat">Chess</span>
                        <button onClick={props.handleRequestExit} aria-label="Back to menu" className="text-zinc-400 hover:text-white transition-colors flex items-center p-2 rounded-lg hover:bg-zinc-700/50">
                            <Icons.ArrowLeft className="w-5 h-5" />
                            <span className="ml-2 text-sm font-semibold">Exit Game</span>
                        </button>
                    </div>
                     <div className="mt-2">
                        {props.showEvaluationBar ? <EvaluationBar evaluation={props.evaluation} isLoading={props.isComputerThinking && !props.analysisMode} /> : <div className="h-3" />}
                    </div>
                    {(props.showMoveFeedback || props.analysisMode) ? (
                        <AnalysisDisplay 
                            move={props.history[props.currentMoveIndex - 1]}
                            moveIndex={props.currentMoveIndex}
                            analysisMode={props.analysisMode}
                            bestMoveSan={props.analysisBestMoveForPosition?.san}
                            currentMoveAnalysis={props.currentMoveAnalysis}
                        />
                    ) : (
                        <div className="h-10" />
                    )}
                </div>

                {/* Middle Section: Move History */}
                <div className="flex-grow min-h-0 py-2">
                    <MoveHistory
                        history={props.history}
                        currentMoveIndex={props.currentMoveIndex}
                        onNavigate={props.navigateToMove}
                        analysisResults={props.analysisResults}
                    />
                </div>
                
                {/* Bottom Section: Controls */}
                <div className="shrink-0">
                    {!props.analysisMode && <Controls 
                        onControlClick={props.handleControlClick} 
                        isHintEnabled={props.enableHints} 
                        gameMode={props.gameMode}
                        isPostGame={props.isPostGame}
                    />}
                </div>
            </div>
        </div>
    );
};
