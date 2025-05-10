'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/lib/themeContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`border rounded h-7 flex items-center gap-2 px-2 transition-colors duration-200 
        ${isDark ? 'border-gray-600 bg-[#2a2b2f]' : 'border-gray-400 bg-white'}`}
    >
      <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
      <input
        type="text"
        aria-label="Search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`outline-none text-sm w-full transition-colors duration-200 
          ${isDark ? 'bg-[#2a2b2f] text-white placeholder-gray-500' : 'bg-white text-black placeholder-gray-400'}`}
      />
    </div>
  );
};

export default SearchBar;
