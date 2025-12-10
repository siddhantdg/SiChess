

import React from 'react';
import { Board } from './Board';
import { Header } from './Header';
import { OpponentInfo } from './OpponentInfo';
import { EvaluationBar } from './EvaluationBar';
import { MoveHistory } from './MoveHistory';
import { Controls } from './Controls';
import { AnalysisDisplay } from './AnalysisDisplay';
import { PlayerInfo } from './PlayerInfo';
import { LayoutProps, PlayStyle } from '../types';

export const PortraitLayout: React.FC<LayoutProps> = (props) => {
    const isPlayerWhite = props.playerColor === 'w';
    const isCVC = props.gameMode === 'cvc';
    const isPVC = props.gameMode === 'pvc';

    const opponentAdvantage = !isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);
    
    const playerAdvantage = isPlayerWhite
        ? (props.materialAdvantage > 0 ? props.materialAdvantage : 0)
        : (props.materialAdvantage < 0 ? Math.abs(props.materialAdvantage) : 0);

    // In CVC & PVP, Player 1 is White, Player 2 is Black.
    // In PVC, Player 1 is Human, Player 2 is Computer.
    let whitePlayerName: string;
    let blackPlayerName: string;

    if (props.gameMode === 'pvc') {
        if (props.playerColor === 'w') { // Human is White
            whitePlayerName = props.playerNames.player1;
            blackPlayerName = props.playerNames.player2;
        } else { // Human is Black
            whitePlayerName = props.playerNames.player2; // Computer is White
            blackPlayerName = props.playerNames.player1; // Human is Black
        }
    } else { // CVC or PVP
        whitePlayerName = props.playerNames.player1;
        blackPlayerName = props.playerNames.player2;
    }

    const opponentName = isPlayerWhite ? blackPlayerName : whitePlayerName;
    const playerName = isPlayerWhite ? whitePlayerName : blackPlayerName;

    // Determine Play Styles for display
    let opponentPlayStyle: PlayStyle | undefined;
    let playerPlayStyle: PlayStyle | undefined;

    if (isCVC) {
         opponentPlayStyle = props.enginePlayStyles?.black;
         playerPlayStyle = props.enginePlayStyles?.white;
    } else if (isPVC) {
         opponentPlayStyle = props.playStyle;
         // Player is human, no style
    }

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
                            playerName={opponentName}
                            isComputer={isPVC || isCVC}
                            timeInSeconds={isPlayerWhite ? props.player2Time : props.player1Time}
                            isTurn={props.game.turn() !== props.playerColor}
                            difficulty={isCVC ? props.engineDifficulties.black : props.difficulty}
                            analysisMode={props.analysisMode}
                            playStyle={opponentPlayStyle}
                        />
                        <Board
                            fen={props.fen}
                            onMove={props.makeMove}
                            turn={props.game.turn()}
                            lastMove={props.lastMove}
                            getLegalMoves={props.getLegalMoves}
                            enablePieceRotation={props.enablePieceRotation}
                            hintMove={props.hintMove}
                            isInteractionDisabled={props.isComputerThinking || (!!props.gameOverData && !props.analysisMode) || props.gameMode === 'cvc'}
                            analysisMode={props.analysisMode}
                            analysisBestMoveForPosition={props.analysisBestMoveForPosition}
                            currentMoveIndex={props.currentMoveIndex}
                            historyLength={props.history.length}
                            history={props.history}
                            onRequestNavigation={props.navigateToMove}
                            playerColor={props.playerColor}
                            computerMoveToAnimate={props.computerMove}
                        />
                        <PlayerInfo 
                            capturedPieces={isPlayerWhite ? props.capturedPieces.b : props.capturedPieces.w} 
                            materialAdvantage={playerAdvantage}
                            playerName={playerName}
                            timeInSeconds={isPlayerWhite ? props.player1Time : props.player2Time}
                            isTurn={props.game.turn() === props.playerColor}
                            isComputer={isCVC}
                            difficulty={isCVC ? props.engineDifficulties.white : undefined}
                            analysisMode={props.analysisMode}
                            playStyle={playerPlayStyle}
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
                    {props.analysisMode ? (
                        <div className="h-12 bg-[#18181a]" />
                    ) : (
                        <Controls 
                            onControlClick={props.handleControlClick} 
                            isHintEnabled={props.enableHints}
                            gameMode={props.gameMode}
                            isPostGame={props.isPostGame}
                            enableTakebacks={props.enableTakebacks}
                            isSpectatorModePaused={props.isSpectatorModePaused}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};