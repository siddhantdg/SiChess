
import React from 'react';

const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Computer: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
  </svg>
);

const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Settings: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Hint: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const Undo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" transform="scale(-1, 1) translate(-24, 0)" />
  </svg>
);

const Resign: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
    </svg>
);

const Player: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const Crown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
  </svg>
);

const TwoPlayers: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const Info: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const Github: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386C24 5.373 18.627 0 12 0z" />
  </svg>
);

const Mail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const Instagram: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const Pawn: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M15 9.5c0 1.38-1.12 2.5-2.5 2.5S10 10.88 10 9.5 11.12 7 12.5 7s2.5 1.12 2.5 2.5zM12.5 2C10.57 2 9 3.57 9 5.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5S14.43 2 12.5 2zM5 20h15v2H5v-2zm0-2h15v-1c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v1z"/></svg>
);

const Knight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.57 2.14c-1.89.28-3.48 1.44-4.5 2.86-.78 1.08-1.24 2.3-1.35 3.57-.13 1.51.36 2.94 1.28 4.08L6 15.47v2.03h2.2v-1.7l1.79-1.79c.14.43.36.83.64 1.2l-.39.39-1.06 1.06-2.12 2.12h14.14l-2.12-2.12-1.06-1.06-.39-.39c.28-.37.5-.77.64-1.2l1.79 1.79V17.5h2.2v-2.03l-1.99-2.82c.92-1.14 1.4-2.57 1.28-4.08-.11-1.27-.57-2.49-1.35-3.57-1.02-1.42-2.61-2.58-4.5-2.86M11 5.3c.63-.9 1.58-1.5 2.65-1.5s2.02.6 2.65 1.5c.98 1.35.82 3.1-.38 4.25-.97.92-2.38 1.19-3.62.68l-2.07 2.93h6.14l-2.07-2.93c-1.24.51-2.65.24-3.62-.68-1.2-1.15-1.36-2.9-.38-4.25z"/></svg>
);

const Rook: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5 20h14v2H5v-2zm0-2h14v-1c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v1zm7.5-12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM15 2H9v6h6V2zm-2 4h-2V4h2v2z"/></svg>
);

const Queen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5 20h14v2H5v-2zm0-2h14v-1c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v1zm7-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5.22 4.39l1.41 1.41C9.26 11.23 10.54 12 12 12s2.74-.77 3.81-2.2l1.41-1.41L18.64 5l-1.41-1.41L15.81 5l-1.04-1.04-1.41 1.41-1.36 1.36-1.36-1.36-1.41-1.41L8.15 5l-1.41-1.41L5.32 5l1.41 1.41L8.15 7.83l-1.36 1.36z"/></svg>
);

const Analyse: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Icons for color selection using actual piece images
const KingWhite: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 150 150" {...props}>
      <image href="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" width="150" height="150" />
    </svg>
);

const KingBlack: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 150 150" {...props}>
      <image href="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" width="150" height="150" />
    </svg>
);

const KingRandom: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 150 150" {...props}>
        <defs>
            <clipPath id="clip-left-half-king-img">
                <rect x="0" y="0" width="75" height="150" />
            </clipPath>
        </defs>
        <image href="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png" width="150" height="150" />
        <image href="https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png" width="150" height="150" clipPath="url(#clip-left-half-king-img)" />
    </svg>
);

const AnalysisIcon: React.FC<{ bgColor: string; children: React.ReactNode } & React.SVGProps<SVGSVGElement>> = ({ bgColor, children, ...props }) => (
    <svg viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="11" fill={bgColor} />
        {children}
    </svg>
);

export const Icons = {
  ArrowLeft,
  Computer,
  ChevronLeft,
  ChevronRight,
  Settings,
  Hint,
  Undo,
  Resign,
  Player,
  Crown,
  TwoPlayers,
  Info,
  Github,
  Mail,
  Instagram,
  Pawn,
  Knight,
  Rook,
  Queen,
  Analyse,
  KingWhite,
  KingBlack,
  KingRandom,
  Analysis: {
    Brilliant: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#38bdf8" {...props}>
            <text x="12" y="17" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">!</text>
        </AnalysisIcon>
    ),
    Best: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#84cc16" {...props}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white"/>
        </AnalysisIcon>
    ),
    Excellent: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#22c55e" {...props}>
             <path d="M9 20v-8h3.33L12 7l-.33 5H9zM7 11H4v9h3z" transform="scale(0.8) translate(3, 1)" fill="white"/>
             <path d="M7.83 5.95L4.24 9.54 3 8.31l3.59-3.59L8.41 3l3.59 3.59L15.59 3l1.83 1.83L13.83 8.41l3.59 3.59-1.23 1.23-3.59-3.59L9.01 13.2l-1.23-1.23 3.59-3.59-3.54-3.43z" fill="white" opacity="0"/>
        </AnalysisIcon>
    ),
    Good: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#a3e635" {...props}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/>
        </AnalysisIcon>
    ),
    Book: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#ca8a04" {...props}>
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="white"/>
        </AnalysisIcon>
    ),
    Inaccuracy: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#facc15" {...props}>
            <text x="12" y="17" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">?!</text>
        </AnalysisIcon>
    ),
    Mistake: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#f97316" {...props}>
            <text x="12" y="17" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">?</text>
        </AnalysisIcon>
    ),
    Miss: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#ef4444" {...props}>
            <path stroke="white" strokeWidth="2.5" d="M 6,6 L 18,18 M 18,6 L 6,18" />
        </AnalysisIcon>
    ),
    Blunder: (props: React.SVGProps<SVGSVGElement>) => (
        <AnalysisIcon bgColor="#dc2626" {...props}>
            <text x="12" y="18" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">??</text>
        </AnalysisIcon>
    ),
  }
};
