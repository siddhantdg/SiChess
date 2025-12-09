import React from 'react';
import { Icons } from './Icons';

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="flex justify-between items-center p-3 bg-[#18181a]">
      <button onClick={onBack} aria-label="Back to menu" className="text-zinc-400 hover:text-white transition-colors">
        <Icons.ArrowLeft className="w-6 h-6" />
      </button>
      <div className="flex items-center">
        <span className="text-xl font-bold text-zinc-200 font-montserrat">Chess</span>
      </div>
      <div className="w-6 h-6" /> {/* Spacer */}
    </header>
  );
};
