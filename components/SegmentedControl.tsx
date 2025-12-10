
import React from 'react';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
}

export const SegmentedControl = <T extends string>({ 
  options, 
  value, 
  onChange, 
  className = '', 
  itemClassName = 'text-xs sm:text-sm' 
}: SegmentedControlProps<T>) => {
  const selectedIndex = options.findIndex(opt => opt.value === value);
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <div className={`relative flex bg-[#18181a] p-1 rounded-2xl ${className}`}>
      <div
        className="absolute top-1 bottom-1 bg-sky-600 rounded-xl shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`, // Subtracting horizontal padding (p-1 = 0.25rem * 2)
          left: '0.25rem', // Starting after the left padding
          transform: `translateX(${safeIndex * 100}%)`,
        }}
      />
      
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 relative z-10 py-2 font-semibold rounded-xl transition-colors duration-200 focus:outline-none ${itemClassName} ${
            value === option.value ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
