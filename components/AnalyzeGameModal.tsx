import React, { useState } from 'react';

interface AnalyzeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (pgn: string) => Promise<boolean>;
}

const PGN_PLACEHOLDER = `Example:
[Event "Casual Game"]
[Site "SiChess"]
[Date "2024.01.01"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 1-0`;

export const AnalyzeGameModal: React.FC<AnalyzeGameModalProps> = ({ isOpen, onClose, onAnalyze }) => {
  const [pgn, setPgn] = useState('');
  const [pgnError, setPgnError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleAnalyzeClick = async () => {
    if (pgn.trim() && !isValidating) {
      setIsValidating(true);
      setPgnError(null); // Clear previous errors on a new attempt
      try {
        const success = await onAnalyze(pgn);
        if (!success) {
          setPgnError('Invalid PGN format. Please check the pasted text and try again.');
        } else {
          // On success, the parent component closes the modal.
          // Reset our internal PGN state for the next time it opens.
          setPgn('');
        }
      } catch (error) {
        console.error("Error during PGN validation:", error);
        setPgnError("Invalid PGN format. Please check the pasted text and try again.");
      } finally {
        setIsValidating(false);
      }
    }
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
        aria-labelledby="analyze-game-modal-title"
      >
        <div
            className="bg-[#18181a] rounded-t-3xl shadow-xl border-t border-zinc-700 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
          <header className="shrink-0 px-6 pt-6 pb-4">
            <div className="max-w-sm mx-auto text-center">
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />
              <h2 id="analyze-game-modal-title" className="text-3xl font-bold text-white">
                  Analyze Game
              </h2>
              <p className="text-zinc-400 mt-2 text-sm max-w-xs mx-auto">Paste a PGN from another platform to get an in-depth analysis.</p>
            </div>
          </header>
          
          <main className="flex-grow min-h-0 overflow-y-auto scrollbar-hide px-6">
            <div className="max-w-sm mx-auto">
                <textarea
                  value={pgn}
                  onChange={(e) => {
                    setPgn(e.target.value);
                    if (pgnError) setPgnError(null);
                  }}
                  placeholder={PGN_PLACEHOLDER}
                  className="w-full h-48 bg-[#2a2a2c] text-zinc-300 border border-zinc-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 font-roboto-mono text-sm resize-none"
                  aria-label="Paste PGN here"
                />
                {pgnError && (
                  <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-xl text-red-300 text-sm text-center animate-scale-in">
                    {pgnError}
                  </div>
                )}
            </div>
          </main>

          <footer className="shrink-0 px-6 pt-4 pb-8">
            <div className="max-w-sm mx-auto">
              <button
                onClick={handleAnalyzeClick}
                disabled={!pgn.trim() || isValidating}
                className="w-full bg-sky-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-sky-500 transition-colors duration-200 disabled:bg-sky-800/50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validating...' : 'Analyze'}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};