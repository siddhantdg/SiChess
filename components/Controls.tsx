import React from 'react';
import { Icons } from './Icons';
import { ControlAction } from '../types';

interface ControlsProps {
  onControlClick: (action: ControlAction) => void;
  isHintEnabled: boolean;
  gameMode: 'pvc' | 'pvp';
  isPostGame: boolean;
}

const ControlButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, label, onClick, disabled }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`flex flex-col items-center space-y-1 text-zinc-400 transition-colors ${
      disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export const Controls: React.FC<ControlsProps> = ({ onControlClick, isHintEnabled, gameMode, isPostGame }) => {
  return (
    <div className="bg-[#18181a] p-3 flex justify-around items-center z-20">
      <ControlButton
        icon={<Icons.Settings className="w-7 h-7" />}
        label="Settings"
        onClick={() => onControlClick('settings')}
      />
      {gameMode === 'pvc' && (
        isPostGame ? (
          <ControlButton
            icon={<Icons.Analyse className="w-7 h-7" />}
            label="Analyse"
            onClick={() => onControlClick('analyse')}
          />
        ) : (
          <ControlButton
            icon={<Icons.Resign className="w-7 h-7" />}
            label="Resign"
            onClick={() => onControlClick('resign')}
          />
        )
      )}

      {/* In PvP mode post-game, show Analyse instead of Hint */}
      {gameMode === 'pvp' && isPostGame ? (
        <ControlButton
          icon={<Icons.Analyse className="w-7 h-7" />}
          label="Analyse"
          onClick={() => onControlClick('analyse')}
        />
      ) : (
        // Otherwise (in-game PvP or any state of PvC), show the Hint button
        <ControlButton
          icon={<Icons.Hint className="w-7 h-7" />}
          label="Hint"
          onClick={() => onControlClick('hint')}
          disabled={!isHintEnabled || isPostGame}
        />
      )}
      
      <ControlButton
        icon={<Icons.Undo className="w-7 h-7" />}
        label="Undo"
        onClick={() => onControlClick('undo')}
        disabled={isPostGame}
      />
    </div>
  );
};
