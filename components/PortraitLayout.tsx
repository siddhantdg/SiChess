
import React from 'react';
import { Board } from './Board';
import { Header } from './Header';
import { OpponentInfo } from './OpponentInfo';
import { EvaluationBar } from './EvaluationBar';
import { MoveHistory } from './MoveHistory';
import { Controls } from './Controls';
import { AnalysisDisplay } from './AnalysisDisplay';
import { PlayerInfo } from './PlayerInfo';
import { LayoutProps } from '../types';

export const PortraitLayout: React.FC<LayoutProps> = (props) => {
    const isPlayerWhite = props.playerColor === 'w';

    const opponentAdvantage = !isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);
    
    const playerAdvantage = isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col flex-grow min-h-0">
                <div className="shrink-0">
                    <Header onBack={props.handleRequestExit}/>
                    <div className="px-2 pb-1">
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
                </div>

                <main className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-y-auto">
                    <div className="w-full max-w-md flex flex-col py-2">
                        <OpponentInfo 
                            capturedPieces={isPlayerWhite ? props.capturedPieces.w : props.capturedPieces.b} 
                            materialAdvantage={opponentAdvantage}
                            playerName={props.playerNames.player2}
                            isComputer={props.gameMode === 'pvc'}
                            timeInSeconds={isPlayerWhite ? props.player2Time : props.player1Time}
                            isTurn={props.game.turn() !== props.playerColor}
                            difficulty={props.difficulty}
                        />
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
                        <PlayerInfo 
                            capturedPieces={isPlayerWhite ? props.capturedPieces.b : props.capturedPieces.w} 
                            materialAdvantage={playerAdvantage}
                            playerName={props.playerNames.player1}
                            timeInSeconds={isPlayerWhite ? props.player1Time : props.player2Time}
                            isTurn={props.game.turn() === props.playerColor}
                        />
                    </div>
                </main>
                
                <div className="shrink-0">
                    <MoveHistory
                        history={props.history}
                        currentMoveIndex={props.currentMoveIndex}
                        onNavigate={props.navigateToMove}
                        analysisResults={props.analysisResults}
                    />
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
