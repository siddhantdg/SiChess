import React from 'react';
import { Difficulty, difficultyLevels } from '../types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const getDifficultyColor = (elo: Difficulty): string => {
    if (elo <= 900) return '#4CAF50';    // Beginner: Vibrant Green
    if (elo <= 1500) return '#FFC107';   // Intermediate: Rich Amber
    if (elo <= 1900) return '#FF9800';   // Advanced: Bright Orange
    if (elo <= 2300) return '#FF5722';   // Expert: Deep Orange
    if (elo <= 2500) return '#F44336';   // Master: Alert Red
    if (elo <= 2700) return '#D32F2F';   // Grandmaster: Crimson Red
    if (elo <= 2900) return '#9C27B0';   // Super GM: Royal Purple
    return '#E91E63';                   // Ultimate: Electric Magenta
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onSelectDifficulty }) => {
    const currentIndex = difficultyLevels.findIndex(d => d.elo === selectedDifficulty);
    const selectedIndex = currentIndex !== -1 ? currentIndex : 8; // Default to 1200 ELO

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newIndex = parseInt(event.target.value, 10);
        onSelectDifficulty(difficultyLevels[newIndex].elo);
    };
    
    const progress = (selectedIndex / (difficultyLevels.length - 1)) * 100;
    const progressColor = getDifficultyColor(selectedDifficulty);
    const trackColor = '#3f3f46'; // zinc-700
    const sliderStyle = {
        background: `linear-gradient(to right, ${progressColor} ${progress}%, ${trackColor} ${progress}%)`
    };

    const currentDetails = difficultyLevels[selectedIndex];

    return (
        <div className="w-full">
            <div className="mb-3 px-1 text-left flex items-baseline">
                <span className="text-2xl font-bold text-white">{currentDetails.label}</span>
                <span className="ml-2 text-lg font-normal text-zinc-400">{currentDetails.elo}</span>
            </div>
            <input
                type="range"
                min="0"
                max={difficultyLevels.length - 1}
                step="1"
                value={selectedIndex}
                onChange={handleChange}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer difficulty-slider"
                style={sliderStyle}
                aria-label={`Difficulty: ${currentDetails.label} ${currentDetails.elo}`}
            />
        </div>
    );
};