import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, ariaLabel = "Toggle feature", disabled }) => {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#18181a] focus:ring-sky-500 ${
        isOn ? 'bg-sky-600' : 'bg-[#2a2a2c]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};