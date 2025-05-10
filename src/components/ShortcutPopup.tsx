import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ShortcutPopupProps {
  onClose: () => void;
  theme?: 'light' | 'dark'; 
}

export default function ShortcutPopup({ onClose, theme }: ShortcutPopupProps) {
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const keys = [
    { key: 'r', label: 'Reply Mail' },
    { key: 'd', label: 'Delete Mail' },
    { key: 't', label: 'Show Timeline' },
    { key: 's', label: 'Show Summary' },
    { key: 'Esc', label: 'Close Popup' },
  ];

  return (
    <div className={`${isDark ? 'bg-[white]/60' : 'bg-[black]/60'} fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm`}>
      <div className={`${isDark ? 'bg-[#1F1F1F] text-white' : 'bg-white text-gray-900'} relative w-full max-w-md rounded-xl p-6 shadow-xl transition-all`}>
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>

        <ul className="space-y-3">
          {keys.map((shortcut, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className={`${isDark ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-800'} px-2.5 py-1.5 rounded-md text-sm font-mono shadow`}>
                {shortcut.key}
              </span>
              <span className="text-sm">{shortcut.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
