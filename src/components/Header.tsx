'use client';

import { useTheme } from '@/lib/themeContext';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import React from 'react';

const Workspace = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <p className="text-[12px]">Tims Workspace</p>
      <span>
        <ChevronDown />
      </span>
    </div>
  );
};

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  
  const lineColor = isDark ? '#444' : '#ddd'; 

  return (
    <div
      className={`flex justify-between items-center py-4 px-4 sm:px-6 md:px-8 h-[64px] 
      border-b transition-colors`}
      style={{ borderColor: lineColor }} 
    >
      <p className="text-lg sm:text-xl">Onebox</p>
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex justify-center items-center border rounded-3xl transition-colors hover:bg-gray-200 dark:hover:bg-gray-200"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-black" />
          )}
        </button>
        <Workspace />
      </div>
    </div>
  );
};

export default Header;
