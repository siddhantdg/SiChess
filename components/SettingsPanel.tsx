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
  enablePieceRotation: boolean;
  onTogglePieceRotation: () => void;
  timeControl: 'none' | '10min' | 'custom';
  onSetTimeControl: (mode: 'none' | '10min' | 'custom') => void;
  gameMode: 'pvc' | 'pvp';
}

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-4">
        <span className="text-lg text-zinc-200 font-medium">{label}</span>
        {children}
    </div>
);

const TimeControlButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  position: 'left' | 'middle' | 'right';
  disabled?: boolean;
}> = ({ label, isActive, onClick, position, disabled }) => {
  const roundedClass = position === 'left' ? 'rounded-l-xl' : position === 'right' ? 'rounded-r-xl' : '';
  const borderClass = position !== 'right' ? 'border-r border-zinc-600' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500 ${
        isActive ? 'bg-sky-600 text-white' : 'bg-[#2a2a2c] text-zinc-300 hover:bg-[#3a3a3c]'
      } ${roundedClass} ${borderClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose,
    showEvaluationBar,
    onToggleEvaluationBar,
    showMoveFeedback,
    onToggleMoveFeedback,
    enableHints,
    onToggleHints,
    enablePieceRotation,
    onTogglePieceRotation,
    timeControl,
    onSetTimeControl,
    gameMode,
 }) => {

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
                  <SettingsRow label="Time Control">
                      <div className="inline-flex rounded-xl shadow-sm" role="group">
                          <TimeControlButton label="None" isActive={timeControl === 'none'} onClick={() => onSetTimeControl('none')} position="left" />
                          <TimeControlButton label="10 min" isActive={timeControl === '10min'} onClick={() => onSetTimeControl('10min')} position="middle" />
                          <TimeControlButton label="Custom" isActive={timeControl === 'custom'} onClick={() => onSetTimeControl('custom')} position="right" />
                      </div>
                  </SettingsRow>
                   <SettingsRow label="Evaluation Bar">
                      <ToggleSwitch isOn={showEvaluationBar} onToggle={onToggleEvaluationBar} />
                  </SettingsRow>
                   <SettingsRow label="Move Feedback">
                      <ToggleSwitch isOn={showMoveFeedback} onToggle={onToggleMoveFeedback} />
                  </SettingsRow>
                   <SettingsRow label="Hints">
                      <ToggleSwitch isOn={enableHints} onToggle={onToggleHints} />
                  </SettingsRow>
                   <SettingsRow label="Piece Rotation">
                      <ToggleSwitch isOn={enablePieceRotation} onToggle={onTogglePieceRotation} disabled={gameMode === 'pvc'} />
                  </SettingsRow>
              </div>
          </div>
      </div>
    </>
  );
};