'use client';

import { Send } from 'lucide-react';
import React from 'react';
import { useTheme } from '@/lib/themeContext';

type InboxProps = {
  fromEmail: string;
  subject: string;
  id: number;
  handleChangeEmail: (threadId: number) => void;
  threadId: number;
  isSelected: boolean;
};

const InboxEmailCard: React.FC<InboxProps> = ({
  threadId,
  fromEmail,
  subject,
  handleChangeEmail,
  isSelected,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => handleChangeEmail(threadId)}
      className={`
        w-full
        cursor-pointer
        transition-colors
        duration-200
        px-6 py-4
        ${isSelected 
          ? `
              border-l-4 border-blue-300 bg-${isDark ? '[#3a3f47]' : 'blue-100'} border-b-0
            ` 
          : `
              border-b ${isDark ? 'border-[#2c2c2c]' : 'border-gray-200'} border-l-4 border-transparent
              ${isDark ? 'hover:bg-[#3d3e42]' : 'hover:bg-gray-100'}
            `
        }
      `}
    >
      <div className="flex items-center justify-between">
        <p
          className={`
            text-sm font-medium
            ${isDark ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          {fromEmail}
        </p>
        
        <p
          className={`
            text-xs
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}
        >
          Mar 7
        </p>
      </div>

      <p
        className={`
          mt-2 text-sm line-clamp-1 
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}
      >
        {subject}
      </p>

      <div className="flex items-center gap-4 mt-3">
        
      <div
  className={`
    flex items-center gap-2 px-3 py-1 border rounded-lg
    ${isDark ? 'bg-[#3d3e42] border-gray-500' : 'bg-gray-200 border-gray-400'}
  `}
>
  <span
    className={`
      w-2 h-2 rounded-full ${isDark ? 'bg-green-500' : 'bg-green-700'}
    `}
  />
  <span
    className={`
      text-[10px] 
      ${isDark ? 'text-green-300' : 'text-green-700'} 
      font-medium
    `}
  >
    Interested
  </span>
</div>


        <div
          className={`
            flex items-center gap-2 px-3 py-1 border rounded-lg
            bg-[#3d3e42] border-gray-500
            ${isDark ? 'bg-[#3d3e42] border-gray-500' : 'bg-gray-200 border-gray-400'}
          `}
        >
          <Send className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-600'}`} />

          <span
            className={`
              text-[10px] ${isDark ? 'text-white' : 'text-gray-600'} font-medium
              font-semibold
            `}
          >
            Campaign
          </span>
        </div>

      </div>
    </div>
  );
};

export default InboxEmailCard;
