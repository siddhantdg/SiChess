import React from 'react';
import { Icons } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
        aria-labelledby="about-modal-title"
      >
        <div className="bg-[#18181a] rounded-t-3xl w-full max-w-2xl mx-auto p-4 pb-8 flex flex-col">
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-3 shrink-0" />

            <div className="flex flex-col items-center justify-center px-2">
                <h3 id="about-modal-title" className="text-3xl font-bold text-zinc-100 mb-5">About</h3>
                <div className="bg-[#2a2a2c] rounded-2xl p-5 text-left font-roboto-mono w-full max-w-sm">
                    <div className="text-zinc-400 text-sm space-y-2 my-4">
                        <p><span className="font-semibold text-zinc-300">Developed by:</span> Siddhant</p>
                        <p><span className="font-semibold text-zinc-300">Version:</span> 1.0.0</p>
                        <p>© 2025 Siddhant. All Rights Reserved.</p>
                    </div>

                    <p className="text-zinc-500 text-sm my-4">
                        Built with love and powered by modern open-source chess logic.
                    </p>

                    <div className="flex justify-center items-center space-x-6 mt-6">
                      <a href="https://github.com/siddhantdg" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="GitHub">
                        <Icons.Github className="w-6 h-6" />
                      </a>
                      <a href="mailto:siddhantdigraje77@gmail.com" className="text-zinc-400 hover:text-white transition-colors" aria-label="Email">
                        <Icons.Mail className="w-6 h-6" />
                      </a>
                      <a href="https://instagram.com/siddhant.07_" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Instagram">
                        <Icons.Instagram className="w-6 h-6" />
                      </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};