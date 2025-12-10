
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Difficulty, HandicapSettings, PlayStyle } from '../types';
import { DifficultySelector } from './DifficultySelector';
import { ToggleSwitch } from './ToggleSwitch';
import { SegmentedControl } from './SegmentedControl';

interface NameInputModalProps {
  mode: 'pvc' | 'pvp';
  isOpen: boolean;
  onStart: (
    names: { player1: string; player2: string },
    options: {
        colorPref?: 'w' | 'b' | 'random',
        selectedDifficulty?: Difficulty,
        isHandicap?: boolean,
        handicapConfig?: HandicapSettings,
        playStyle?: PlayStyle
    }
  ) => void;
  onClose: () => void;
  timeControl: 'none' | '10min' | 'custom';
  onTimeControlChange: (mode: 'none' | '10min' | 'custom') => void;
  customTimes: { p1: number, p2: number };
  onCustomTimeChange: (p1: number, p2: number) => void;
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
  enableChess960: boolean;
  onToggleChess960: () => void;
  handicapSettings: HandicapSettings;
  onHandicapSettingsChange: React.Dispatch<React.SetStateAction<HandicapSettings>>;
}

const ColorIconButton: React.FC<{
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  ariaLabel: string;
}> = ({ icon, isSelected, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181a] focus:ring-sky-500 ${
      isSelected ? 'bg-sky-600 scale-110' : 'bg-[#2a2a2c] hover:bg-[#3a3a3c]'
    }`}
  >
    {icon}
  </button>
);

const TimeControlButton: React.FC<{
  label: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, isActive, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 text-sm transition-colors rounded-lg focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500 text-center font-semibold ${
        isActive ? 'bg-sky-600 text-white' : 'bg-[#2a2a2c] text-zinc-300 hover:bg-[#3a3a3c]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

const HandicapOptionButton: React.FC<{
  label: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}> = ({ label, isActive, onClick, className }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1 text-sm transition-colors rounded-lg focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500 text-center font-semibold ${
        isActive ? 'bg-sky-600 text-white' : 'bg-[#2a2a2c] text-zinc-300 hover:bg-[#3a3a3c]'
      } ${className || ''}`}
    >
      {label}
    </button>
);

const HandicapStepperButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}> = ({ children, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-1 w-12 text-sm transition-colors rounded-lg focus:outline-none focus:z-10 focus:ring-2 focus:ring-sky-500 text-center font-semibold bg-[#2a2a2c] text-zinc-300 hover:bg-[#3a3a3c] disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

interface TimeControlSectionProps {
    timeControl: 'none' | '10min' | 'custom';
    onTimeControlChange: (mode: 'none' | '10min' | 'custom') => void;
    p1Time: string;
    onP1TimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    p2Time: string;
    onP2TimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onTimeBlur: () => void;
    mode: 'pvc' | 'pvp';
}

const TimeControlSection: React.FC<TimeControlSectionProps> = ({
    timeControl, onTimeControlChange, p1Time, onP1TimeChange, p2Time, onP2TimeChange, onTimeBlur, mode
}) => (
    <div>
        <div className="flex justify-between items-center pt-2">
            <label className="text-sm font-medium text-zinc-400">
                Time Control
            </label>
            <div className="flex w-auto space-x-2" role="group">
                <TimeControlButton label="None" isActive={timeControl === 'none'} onClick={() => onTimeControlChange('none')} />
                <TimeControlButton
                    label="10 min"
                    isActive={timeControl === '10min'}
                    onClick={() => onTimeControlChange('10min')}
                />
                <TimeControlButton label="Custom" isActive={timeControl === 'custom'} onClick={() => onTimeControlChange('custom')} />
            </div>
        </div>
        <div className={`collapsible space-y-4 ${timeControl === 'custom' ? 'open' : ''}`}>
             <div>
                <label htmlFor={`p1Time-${mode}`} className="text-sm font-medium text-zinc-400 block mb-2 text-left">
                    {mode === 'pvc' ? 'Your Time (minutes)' : 'Player 1 (White) Time (minutes)'}
                </label>
                <input
                    id={`p1Time-${mode}`}
                    type="number" value={p1Time} onChange={onP1TimeChange} onBlur={onTimeBlur}
                    min="1" max="99"
                    className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                />
            </div>
            <div>
                <label htmlFor={`p2Time-${mode}`} className="text-sm font-medium text-zinc-400 block mb-2 text-left">
                     {mode === 'pvc' ? "Computer's Time (minutes)" : 'Player 2 (Black) Time (minutes)'}
                </label>
                <input
                    id={`p2Time-${mode}`}
                    type="number" value={p2Time} onChange={onP2TimeChange} onBlur={onTimeBlur}
                    min="1" max="99"
                    className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                />
            </div>
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        {children}
    </div>
);

export const NameInputModal: React.FC<NameInputModalProps> = ({ mode, isOpen, onStart, onClose, timeControl, onTimeControlChange, customTimes, onCustomTimeChange, showEvaluationBar, onToggleEvaluationBar, showMoveFeedback, onToggleMoveFeedback, enableHints, onToggleHints, enableTakebacks, onToggleTakebacks, enablePieceRotation, onTogglePieceRotation, enableChess960, onToggleChess960, handicapSettings, onHandicapSettingsChange }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [colorPref, setColorPref] = useState<'w' | 'b' | 'random'>('random');
  const [difficulty, setDifficulty] = useState<Difficulty>(1200);
  const [activeTab, setActiveTab] = useState<'classic' | 'handicap'>('classic');
  const [playStyle, setPlayStyle] = useState<PlayStyle>('balanced');

  const [p1Time, setP1Time] = useState(String(customTimes.p1));
  const [p2Time, setP2Time] = useState(String(customTimes.p2));

  useEffect(() => {
    if (isOpen) {
        setP1Time(String(customTimes.p1));
        setP2Time(String(customTimes.p2));
    }
  }, [isOpen, customTimes]);

  useEffect(() => {
    if (!isOpen) return; // Only reset when opening
    if (mode === 'pvc') {
      setPlayer1Name('Player');
      setPlayer2Name('Computer');
      setColorPref('random');
      setDifficulty(1200);
      setActiveTab('classic');
      setPlayStyle('balanced');
      onHandicapSettingsChange({ queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0 }); // Reset handicap on open
    } else {
      setPlayer1Name('White');
      setPlayer2Name('Black');
    }
  }, [mode, isOpen, onHandicapSettingsChange]);

  const handleStart = () => {
     if (timeControl === 'custom') {
        const p1 = parseInt(p1Time, 10);
        const p2 = parseInt(p2Time, 10);
        onCustomTimeChange(p1, p2);
    }
    onStart(
      {
        player1: player1Name.trim() || (mode === 'pvc' ? 'Player' : 'White'),
        player2: mode === 'pvc' ? 'Computer' : (player2Name.trim() || 'Black'),
      },
      {
        colorPref: mode === 'pvc' ? colorPref : undefined,
        selectedDifficulty: mode === 'pvc' ? difficulty : undefined,
        isHandicap: mode === 'pvc' && activeTab === 'handicap',
        handicapConfig: handicapSettings,
        playStyle: mode === 'pvc' ? playStyle : undefined
      }
    );
  };

  const handlePawnChange = (amount: number) => {
    onHandicapSettingsChange(prev => {
        const newValue = prev.pawn + amount;
        if (newValue >= 0 && newValue <= 8) {
            return { ...prev, pawn: newValue };
        }
        return prev;
    });
  };

  const colorDisplayNames: Record<'w' | 'b' | 'random', string> = {
    w: 'White',
    b: 'Black',
    random: 'Random',
  };

  const handleTimeInputBlur = () => {
    const p1 = parseInt(p1Time, 10);
    const p2 = parseInt(p2Time, 10);
    onCustomTimeChange(p1, p2);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="name-input-modal-title"
      >
        <div
            className="bg-[#18181a] rounded-t-3xl shadow-xl border-t border-zinc-700 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
          <header className="shrink-0 px-6 pt-6 pb-4">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />
              <h2 id="name-input-modal-title" className="text-2xl font-bold text-white">
                  {mode === 'pvc' ? 'Game Setup' : 'Player vs Player'}
              </h2>
            </div>
          </header>
          
          <main className="flex-grow min-h-0 overflow-y-auto scrollbar-hide px-6">
            <div className="max-w-sm mx-auto">
              {mode === 'pvc' && (
                <>
                  <div className="mb-6">
                    <SegmentedControl<'classic' | 'handicap'>
                      options={[
                        { label: 'Classic', value: 'classic' },
                        { label: 'Handicap', value: 'handicap' }
                      ]}
                      value={activeTab}
                      onChange={setActiveTab}
                      className="bg-[#202022]" // Slightly lighter bg for the outer tabs
                      itemClassName="text-sm sm:text-base py-2" // Bigger text and padding
                    />
                  </div>

                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: activeTab === 'classic' ? 'translateX(0%)' : 'translateX(-100%)' }}
                    >
                      <div className="w-full shrink-0 px-1">
                        <div className="space-y-7 text-left">
                            <div className="bg-[#202022] px-4 pt-4 pb-6 rounded-2xl">
                                <div className="space-y-7">
                                    <div>
                                        <div className="mb-3 px-1">
                                          <label className="text-sm font-medium text-zinc-400">
                                              Play as: <span className="font-semibold text-white">{colorDisplayNames[colorPref]}</span>
                                          </label>
                                        </div>
                                        <div className="flex justify-center space-x-4">
                                          <ColorIconButton
                                              icon={<Icons.KingWhite className="w-8 h-8" />}
                                              isSelected={colorPref === 'w'}
                                              onClick={() => setColorPref('w')}
                                              ariaLabel="Play as white"
                                          />
                                          <ColorIconButton
                                              icon={<Icons.KingRandom className="w-8 h-8" />}
                                              isSelected={colorPref === 'random'}
                                              onClick={() => setColorPref('random')}
                                              ariaLabel="Play as a random color"
                                          />
                                          <ColorIconButton
                                              icon={<Icons.KingBlack className="w-8 h-8" />}
                                              isSelected={colorPref === 'b'}
                                              onClick={() => setColorPref('b')}
                                              ariaLabel="Play as black"
                                          />
                                        </div>
                                    </div>

                                    <div>
                                        <DifficultySelector selectedDifficulty={difficulty} onSelectDifficulty={setDifficulty} />
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium text-zinc-400 block mb-2">
                                          Play Style
                                      </label>
                                      <SegmentedControl<PlayStyle>
                                        options={[
                                          { label: 'Aggressive', value: 'aggressive' },
                                          { label: 'Balanced', value: 'balanced' },
                                          { label: 'Defensive', value: 'defensive' }
                                        ]}
                                        value={playStyle}
                                        onChange={setPlayStyle}
                                      />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="player1-pvc" className="text-sm font-medium text-zinc-400 block mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            id="player1-pvc"
                                            type="text"
                                            value={player1Name}
                                            onChange={(e) => setPlayer1Name(e.target.value)}
                                            placeholder={'Player'}
                                            className="w-full bg-[#3a3a3c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                              <div>
                                <TimeControlSection
                                  timeControl={timeControl}
                                  onTimeControlChange={onTimeControlChange}
                                  p1Time={p1Time}
                                  onP1TimeChange={(e) => setP1Time(e.target.value)}
                                  p2Time={p2Time}
                                  onP2TimeChange={(e) => setP2Time(e.target.value)}
                                  onTimeBlur={handleTimeInputBlur}
                                  mode={mode}
                                />
                                <div className="space-y-1 pt-4">
                                  <SettingsRow label="Evaluation Bar">
                                      <ToggleSwitch isOn={showEvaluationBar} onToggle={onToggleEvaluationBar} />
                                  </SettingsRow>
                                  <SettingsRow label="Move Feedback">
                                      <ToggleSwitch isOn={showMoveFeedback} onToggle={onToggleMoveFeedback} />
                                  </SettingsRow>
                                  <SettingsRow label="Hints">
                                      <ToggleSwitch isOn={enableHints} onToggle={onToggleHints} />
                                  </SettingsRow>
                                  <SettingsRow label="Takebacks (Undo)">
                                      <ToggleSwitch isOn={enableTakebacks} onToggle={onToggleTakebacks} />
                                  </SettingsRow>
                                  <div>
                                      <SettingsRow label="Chess960 (Fischer Random)">
                                          <ToggleSwitch isOn={enableChess960} onToggle={onToggleChess960} />
                                      </SettingsRow>
                                      <div 
                                          className={`collapsible px-1 ${enableChess960 ? 'open' : ''}`}
                                          style={{ marginTop: enableChess960 ? '0.25rem' : '0' }}
                                      >
                                          <p className="text-sm text-zinc-500 text-left leading-relaxed">
                                              Created by chess legend Bobby Fischer, this popular variant of chess places each player's back rank pieces in the same random order.
                                          </p>
                                      </div>
                                  </div>
                                </div>
                              </div>
                        </div>
                      </div>

                      <div className="w-full shrink-0 px-1">
                        <div className="space-y-7 text-left">
                           <div className="bg-[#202022] px-4 pt-4 pb-6 rounded-2xl">
                               <div className="space-y-7">
                                   <div>
                                        <div className="mb-3 px-1">
                                          <label className="text-sm font-medium text-zinc-400">
                                              Play as: <span className="font-semibold text-white">{colorDisplayNames[colorPref]}</span>
                                          </label>
                                        </div>
                                        <div className="flex justify-center space-x-4">
                                          <ColorIconButton
                                              icon={<Icons.KingWhite className="w-8 h-8" />}
                                              isSelected={colorPref === 'w'}
                                              onClick={() => setColorPref('w')}
                                              ariaLabel="Play as white"
                                          />
                                          <ColorIconButton
                                              icon={<Icons.KingRandom className="w-8 h-8" />}
                                              isSelected={colorPref === 'random'}
                                              onClick={() => setColorPref('random')}
                                              ariaLabel="Play as a random color"
                                          />
                                          <ColorIconButton
                                              icon={<Icons.KingBlack className="w-8 h-8" />}
                                              isSelected={colorPref === 'b'}
                                              onClick={() => setColorPref('b')}
                                              ariaLabel="Play as black"
                                          />
                                        </div>
                                    </div>
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="player1-pvc-handicap" className="text-sm font-medium text-zinc-400 block mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            id="player1-pvc-handicap"
                                            type="text"
                                            value={player1Name}
                                            onChange={(e) => setPlayer1Name(e.target.value)}
                                            placeholder={'Player'}
                                            className="w-full bg-[#3a3a3c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                                        />
                                    </div>
                               </div>
                           </div>
                            <div>
                               <div>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                          <label className="text-lg font-semibold text-zinc-200">
                                              <span>Queen</span>
                                          </label>
                                          <div className="grid grid-cols-2 w-40 gap-2" role="group">
                                              {[0, 1].map(val => (
                                                  <HandicapOptionButton 
                                                      key={val} 
                                                      label={val} 
                                                      isActive={handicapSettings.queen === val} 
                                                      onClick={() => onHandicapSettingsChange(prev => ({ ...prev, queen: val as 0 | 1 }))} 
                                                      className="w-full"
                                                  />
                                              ))}
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <label className="text-lg font-semibold text-zinc-200">
                                              <span>Rook</span>
                                          </label>
                                          <div className="flex w-40 justify-between" role="group">
                                              {[0, 1, 2].map(val => (
                                                  <HandicapOptionButton 
                                                      key={val} 
                                                      label={val} 
                                                      isActive={handicapSettings.rook === val} 
                                                      onClick={() => onHandicapSettingsChange(prev => ({ ...prev, rook: val as 0 | 1 | 2 }))} 
                                                      className="w-12"
                                                  />
                                              ))}
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <label className="text-lg font-semibold text-zinc-200">
                                              <span>Bishop</span>
                                          </label>
                                          <div className="flex w-40 justify-between" role="group">
                                              {[0, 1, 2].map(val => (
                                                  <HandicapOptionButton 
                                                      key={val} 
                                                      label={val} 
                                                      isActive={handicapSettings.bishop === val} 
                                                      onClick={() => onHandicapSettingsChange(prev => ({ ...prev, bishop: val as 0 | 1 | 2 }))}
                                                      className="w-12"
                                                  />
                                              ))}
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <label className="text-lg font-semibold text-zinc-200">
                                              <span>Knight</span>
                                          </label>
                                          <div className="flex w-40 justify-between" role="group">
                                              {[0, 1, 2].map(val => (
                                                  <HandicapOptionButton 
                                                      key={val} 
                                                      label={val} 
                                                      isActive={handicapSettings.knight === val} 
                                                      onClick={() => onHandicapSettingsChange(prev => ({ ...prev, knight: val as 0 | 1 | 2 }))} 
                                                      className="w-12"
                                                  />
                                              ))}
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <label className="text-lg font-semibold text-zinc-200">
                                              <span>Pawn</span>
                                          </label>
                                          <div className="flex items-center w-40 justify-between" role="group">
                                              <HandicapStepperButton onClick={() => handlePawnChange(-1)} disabled={handicapSettings.pawn === 0}>-</HandicapStepperButton>
                                              <span className="px-4 py-1 text-sm rounded-lg bg-[#2a2a2c] text-zinc-300 font-semibold w-12 text-center">{handicapSettings.pawn}</span>
                                              <HandicapStepperButton onClick={() => handlePawnChange(1)} disabled={handicapSettings.pawn === 8}>+</HandicapStepperButton>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="border-t border-zinc-700/50 pt-6 mt-6">
                                      <TimeControlSection
                                          timeControl={timeControl}
                                          onTimeControlChange={onTimeControlChange}
                                          p1Time={p1Time}
                                          onP1TimeChange={(e) => setP1Time(e.target.value)}
                                          p2Time={p2Time}
                                          onP2TimeChange={(e) => setP2Time(e.target.value)}
                                          onTimeBlur={handleTimeInputBlur}
                                          mode={mode}
                                      />
                                      <div className="space-y-1 pt-4">
                                          <SettingsRow label="Evaluation Bar">
                                              <ToggleSwitch isOn={showEvaluationBar} onToggle={onToggleEvaluationBar} />
                                          </SettingsRow>
                                          <SettingsRow label="Move Feedback">
                                              <ToggleSwitch isOn={showMoveFeedback} onToggle={onToggleMoveFeedback} />
                                          </SettingsRow>
                                          <SettingsRow label="Hints">
                                              <ToggleSwitch isOn={enableHints} onToggle={onToggleHints} />
                                          </SettingsRow>
                                          <SettingsRow label="Takebacks (Undo)">
                                              <ToggleSwitch isOn={enableTakebacks} onToggle={onToggleTakebacks} />
                                          </SettingsRow>
                                      </div>
                                  </div>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {mode === 'pvp' && (
                  <div className="space-y-7 text-left">
                        <div className="bg-[#202022] px-4 pt-4 pb-6 rounded-2xl">
                            <div className="mb-6">
                                <label htmlFor="player1-pvp" className="text-base font-semibold text-zinc-300 mb-3 flex items-center space-x-2">
                                    <Icons.KingWhite className="w-6 h-6" />
                                    <span>Player 1 (White)</span>
                                </label>
                                <input
                                    id="player1-pvp"
                                    type="text"
                                    value={player1Name}
                                    onChange={(e) => setPlayer1Name(e.target.value)}
                                    placeholder="White"
                                    className="w-full bg-[#3a3a3c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="player2" className="text-base font-semibold text-zinc-300 mb-3 flex items-center space-x-2">
                                    <Icons.KingBlack className="w-6 h-6" />
                                    <span>Player 2 (Black)</span>
                                </label>
                                <input
                                    id="player2"
                                    type="text"
                                    value={player2Name}
                                    onChange={(e) => setPlayer2Name(e.target.value)}
                                    placeholder="Black"
                                    className="w-full bg-[#3a3a3c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <TimeControlSection
                                timeControl={timeControl}
                                onTimeControlChange={onTimeControlChange}
                                p1Time={p1Time}
                                onP1TimeChange={(e) => setP1Time(e.target.value)}
                                p2Time={p2Time}
                                onP2TimeChange={(e) => setP2Time(e.target.value)}
                                onTimeBlur={handleTimeInputBlur}
                                mode={mode}
                            />
                             <div className="space-y-1 pt-4">
                                <SettingsRow label="Evaluation Bar">
                                    <ToggleSwitch isOn={showEvaluationBar} onToggle={onToggleEvaluationBar} />
                                </SettingsRow>
                                <SettingsRow label="Move Feedback">
                                    <ToggleSwitch isOn={showMoveFeedback} onToggle={onToggleMoveFeedback} />
                                </SettingsRow>
                                <SettingsRow label="Takebacks (Undo)">
                                    <ToggleSwitch isOn={enableTakebacks} onToggle={onToggleTakebacks} />
                                </SettingsRow>
                                <SettingsRow label="Piece Rotation">
                                    <ToggleSwitch isOn={enablePieceRotation} onToggle={onTogglePieceRotation} />
                                </SettingsRow>
                                <div>
                                    <SettingsRow label="Chess960 (Fischer Random)">
                                        <ToggleSwitch isOn={enableChess960} onToggle={onToggleChess960} />
                                    </SettingsRow>
                                     <div 
                                        className={`collapsible px-1 ${enableChess960 ? 'open' : ''}`}
                                        style={{ marginTop: enableChess960 ? '0.25rem' : '0' }}
                                    >
                                         <p className="text-sm text-zinc-500 text-left leading-relaxed">
                                            Created by chess legend Bobby Fischer, this popular variant of chess places each player's back rank pieces in the same random order.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>
              )}
            </div>
          </main>

          <footer className="shrink-0 px-6 pt-4 pb-8">
            <div className="max-w-sm mx-auto">
              <button
                  onClick={handleStart}
                  className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200"
              >
                  Start Game
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
