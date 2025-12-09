import React from 'react';

interface TimerProps {
  timeInSeconds: number;
  isActive: boolean;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  // Ensure we don't show negative time if there's a slight delay in game over
  const displayMinutes = Math.max(0, minutes);
  const displaySeconds = totalSeconds < 0 ? '00' : paddedSeconds;

  return `${displayMinutes}:${paddedSeconds}`;
};

export const Timer: React.FC<TimerProps> = ({ timeInSeconds, isActive }) => {
  return (
    <div className={`px-3 py-1 rounded-lg font-mono text-xl font-semibold transition-colors ${
      isActive ? 'bg-zinc-200 text-zinc-900' : 'bg-[#2a2a2c] text-zinc-400'
    }`}>
      {formatTime(timeInSeconds)}
    </div>
  );
};