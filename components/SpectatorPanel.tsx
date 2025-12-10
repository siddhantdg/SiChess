
import React, { useState, useEffect } from 'react';
import { DifficultySelector } from './DifficultySelector';
import { Difficulty, PlayStyle } from '../types';
import { ToggleSwitch } from './ToggleSwitch';
import { Icons } from './Icons';
import { SegmentedControl } from './SegmentedControl';

interface SpectatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBattle: (settings: {
    whiteDifficulty: Difficulty;
    blackDifficulty: Difficulty;
    whiteStyle: PlayStyle;
    blackStyle: PlayStyle;
    timeControl: 'none' | '10min' | 'custom';
    customTimes: { p1: number, p2: number };
    showEvaluationBar: boolean;
    enableTakebacks: boolean;
    isChess960: boolean;
  }) => void;
}

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

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex justify-between items-center py-2">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        {children}
    </div>
);

export const SpectatorPanel: React.FC<SpectatorPanelProps> = ({ isOpen, onClose, onStartBattle }) => {
  const [whiteEngineDifficulty, setWhiteEngineDifficulty] = useState<Difficulty>(1200);
  const [blackEngineDifficulty, setBlackEngineDifficulty] = useState<Difficulty>(1200);
  const [whiteStyle, setWhiteStyle] = useState<PlayStyle>('balanced');
  const [blackStyle, setBlackStyle] = useState<PlayStyle>('balanced');
  
  const [timeControl, setTimeControl] = useState<'none' | '10min' | 'custom'>('none');
  const [customTimes, setCustomTimes] = useState({ p1: 5, p2: 5 });

  const [p1Time, setP1Time] = useState(String(customTimes.p1));
  const [p2Time, setP2Time] = useState(String(customTimes.p2));

  // Default to true, but user cannot toggle it anymore in this panel
  const [showEvaluationBar] = useState<boolean>(true);
  const [enableTakebacks, setEnableTakebacks] = useState<boolean>(true);
  const [isChess960, setIsChess960] = useState<boolean>(false);


  useEffect(() => {
    if (isOpen) {
        setP1Time(String(customTimes.p1));
        setP2Time(String(customTimes.p2));
    }
  }, [isOpen, customTimes]);

  const handleCustomTimeChange = (p1Minutes: number, p2Minutes: number) => {
    const validP1 = !isNaN(p1Minutes) && p1Minutes > 0 ? Math.min(p1Minutes, 99) : 1;
    const validP2 = !isNaN(p2Minutes) && p2Minutes > 0 ? Math.min(p2Minutes, 99) : 1;
    setCustomTimes({ p1: validP1, p2: validP2 });
  };

  const handleTimeInputBlur = () => {
    const p1 = parseInt(p1Time, 10);
    const p2 = parseInt(p2Time, 10);
    handleCustomTimeChange(p1, p2);
  };

  const handleStartClick = () => {
    onStartBattle({
      whiteDifficulty: whiteEngineDifficulty,
      blackDifficulty: blackEngineDifficulty,
      whiteStyle,
      blackStyle,
      timeControl,
      customTimes: {
          p1: parseInt(p1Time, 10) || 5,
          p2: parseInt(p2Time, 10) || 5,
      },
      showEvaluationBar,
      enableTakebacks,
      isChess960,
    });
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
        aria-labelledby="spectator-panel-title"
      >
        <div
            className="bg-[#18181a] rounded-t-3xl shadow-xl border-t border-zinc-700 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
          <header className="shrink-0 px-6 pt-6 pb-4">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />
              <h2 id="spectator-panel-title" className="text-2xl font-bold text-white">
                  Engine Battle
              </h2>
              <p className="text-zinc-400 mt-2 text-xs max-w-xs mx-auto">Set up a battle between two engines.</p>
            </div>
          </header>
          
          <main className="flex-grow min-h-0 overflow-y-auto scrollbar-hide px-6">
            <div className="max-w-sm mx-auto py-4 text-left">
              <div className="space-y-4">
                <div className="bg-[#202022] px-4 pt-3 pb-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center space-x-2">
                        <Icons.KingWhite className="w-6 h-6" />
                        <span>White Engine</span>
                    </h3>
                    <DifficultySelector 
                        selectedDifficulty={whiteEngineDifficulty} 
                        onSelectDifficulty={setWhiteEngineDifficulty} 
                    />
                    <div className="mt-4">
                        <SegmentedControl<PlayStyle>
                          options={[
                            { label: 'Aggressive', value: 'aggressive' },
                            { label: 'Balanced', value: 'balanced' },
                            { label: 'Defensive', value: 'defensive' }
                          ]}
                          value={whiteStyle}
                          onChange={setWhiteStyle}
                        />
                    </div>
                </div>

                <div className="flex items-center text-center">
                    <div className="flex-grow border-t border-zinc-700"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-500">VS</span>
                    <div className="flex-grow border-t border-zinc-700"></div>
                </div>

                <div className="bg-[#202022] px-4 pt-3 pb-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center space-x-2">
                        <Icons.KingBlack className="w-6 h-6" />
                        <span>Black Engine</span>
                    </h3>
                    <DifficultySelector
                        selectedDifficulty={blackEngineDifficulty}
                        onSelectDifficulty={setBlackEngineDifficulty}
                    />
                     <div className="mt-4">
                        <SegmentedControl<PlayStyle>
                          options={[
                            { label: 'Aggressive', value: 'aggressive' },
                            { label: 'Balanced', value: 'balanced' },
                            { label: 'Defensive', value: 'defensive' }
                          ]}
                          value={blackStyle}
                          onChange={setBlackStyle}
                        />
                    </div>
                </div>

                <div className="border-t border-zinc-700/50 pt-6">
                    <div className="flex justify-between items-center pt-2">
                        <label className="text-sm font-medium text-zinc-400">
                            Time Control
                        </label>
                        <div className="flex w-auto space-x-2" role="group">
                            <TimeControlButton label="None" isActive={timeControl === 'none'} onClick={() => setTimeControl('none')} />
                            <TimeControlButton
                                label="10 min"
                                isActive={timeControl === '10min'}
                                onClick={() => setTimeControl('10min')}
                            />
                            <TimeControlButton label="Custom" isActive={timeControl === 'custom'} onClick={() => setTimeControl('custom')} />
                        </div>
                    </div>
                    <div className={`collapsible space-y-4 ${timeControl === 'custom' ? 'open' : ''}`}>
                         <div>
                            <label htmlFor="p1Time-spectator" className="text-sm font-medium text-zinc-400 block mb-2 text-left">
                                White Engine Time (minutes)
                            </label>
                            <input
                                id="p1Time-spectator"
                                type="number" value={p1Time} onChange={(e) => setP1Time(e.target.value)} onBlur={handleTimeInputBlur}
                                min="1" max="99"
                                className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="p2Time-spectator" className="text-sm font-medium text-zinc-400 block mb-2 text-left">
                                Black Engine Time (minutes)
                            </label>
                            <input
                                id="p2Time-spectator"
                                type="number" value={p2Time} onChange={(e) => setP2Time(e.target.value)} onBlur={handleTimeInputBlur}
                                min="1" max="99"
                                className="w-full bg-[#2a2a2c] text-zinc-200 border border-zinc-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 space-y-1">
                        <SettingsRow label="Takebacks (Undo)">
                            <ToggleSwitch isOn={enableTakebacks} onToggle={() => setEnableTakebacks(p => !p)} />
                        </SettingsRow>
                        <div>
                            <SettingsRow label="Chess960 (Fischer Random)">
                                <ToggleSwitch isOn={isChess960} onToggle={() => setIsChess960(p => !p)} />
                            </SettingsRow>
                            <div 
                                className={`collapsible px-1 ${isChess960 ? 'open' : ''}`}
                                style={{ marginTop: isChess960 ? '0.25rem' : '0' }}
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
          </main>

          <footer className="shrink-0 px-6 pt-4 pb-8">
            <div className="max-w-sm mx-auto">
              <button
                onClick={handleStartClick}
                disabled={false}
                className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-base hover:bg-sky-500 transition-colors duration-200 disabled:bg-sky-800/50 disabled:cursor-not-allowed"
              >
                Start Battle
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
