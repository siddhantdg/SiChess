import React from 'react';
import { Icons } from './Icons';

export type ControlAction = 'settings' | 'hint' | 'undo';

interface ControlsProps {
  onControlClick: (action: ControlAction) => void;
  isHintEnabled: boolean;
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

export const Controls: React.FC<ControlsProps> = ({ onControlClick, isHintEnabled }) => {
  return (
    <div className="bg-[#18181a] p-3 flex justify-around items-center z-20">
      <ControlButton
        icon={<Icons.Settings className="w-7 h-7" />}
        label="Settings"
        onClick={() => onControlClick('settings')}
      />
      <ControlButton
        icon={<Icons.Hint className="w-7 h-7" />}
        label="Hint"
        onClick={() => onControlClick('hint')}
        disabled={!isHintEnabled}
      />
      <ControlButton
        icon={<Icons.Undo className="w-7 h-7" />}
        label="Undo"
        onClick={() => onControlClick('undo')}
      />
    </div>
  );
};