
import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  showEvaluationBar: boolean;
  onToggleEvaluationBar: () => void;
  showMoveFeedback: boolean;
  onToggleMoveFeedback: () => void;
  enableHints: boolean;
  onToggleHints: () => void;
  enableTakebacks: boolean;
  onToggleTakebacks: () => void;
  enablePieceRotation: boolean;
  onTogglePieceRotation: () => void;
  gameMode: 'pvc' | 'pvp' | 'cvc';
}

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-4">
        <span className="text-base text-zinc-200 font-medium">{label}</span>
        {children}
    </div>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose,
    showEvaluationBar,
    onToggleEvaluationBar,
    showMoveFeedback,
    onToggleMoveFeedback,
    enableHints,
    onToggleHints,
    enableTakebacks,
    onToggleTakebacks,
    enablePieceRotation,
    onTogglePieceRotation,
    gameMode,
 }) => {
  const isSpectatorMode = gameMode === 'cvc';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#18181a] rounded-t-3xl p-6 shadow-2xl z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
          <div className="max-w-md mx-auto">
              <div className="divide-y divide-zinc-700">
                   {!isSpectatorMode && (
                     <SettingsRow label="Evaluation Bar">
                        <ToggleSwitch isOn={showEvaluationBar} onToggle={onToggleEvaluationBar} />
                     </SettingsRow>
                   )}
                  
                   {!isSpectatorMode && (
                    <SettingsRow label="Move Feedback">
                        <ToggleSwitch isOn={showMoveFeedback} onToggle={onToggleMoveFeedback} />
                    </SettingsRow>
                   )}

                   {gameMode === 'pvc' && (
                    <SettingsRow label="Hints">
                        <ToggleSwitch isOn={enableHints} onToggle={onToggleHints} disabled={isSpectatorMode} />
                    </SettingsRow>
                   )}
                   
                  <SettingsRow label="Takebacks (Undo)">
                      <ToggleSwitch isOn={enableTakebacks} onToggle={onToggleTakebacks} />
                  </SettingsRow>
                  
                  {gameMode === 'pvp' && (
                   <SettingsRow label="Piece Rotation">
                      <ToggleSwitch 
                        isOn={enablePieceRotation} 
                        onToggle={onTogglePieceRotation} 
                      />
                  </SettingsRow>
                  )}
              </div>
          </div>
      </div>
    </>
  );
};
