import React from 'react';

interface TimerProps {
  timeInSeconds: number;
  isActive: boolean;
}

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds <= 0) {
    return '0:00';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : String(seconds);
  return `${minutes}:${paddedSeconds}`;
};

export const Timer: React.FC<TimerProps> = ({ timeInSeconds, isActive }) => {
  return (
    <div className={`w-[4.5rem] text-right px-2 py-1 rounded-lg text-lg font-bold transition-colors ${
      isActive ? 'bg-zinc-200 text-zinc-900' : 'bg-[#2a2a2c] text-zinc-400'
    }`}>
      {formatTime(timeInSeconds)}
    </div>
  );
};