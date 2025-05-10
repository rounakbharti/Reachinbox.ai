'use client';

import { ChevronDown, RotateCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { resetMail } from '@/services/mailService';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/themeContext';

const InboxHeader: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    try {
      const raw = localStorage.getItem('reachinbox-auth');
      if (raw) setToken(JSON.parse(raw));
    } catch (e) {
      console.error('Token parsing error:', e);
    }
  }, []);

  const handleReset = async () => {
    try {
      await resetMail(token);
      router.push('/onebox');
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  return (
    <div className="mb-2">
      {/* Title and reset button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-semibold text-[#4285F4]">All Inbox(s)</h1>
          <ChevronDown className="cursor-pointer text-[#4285F4]" />
        </div>

        <button
          onClick={handleReset}
          className={`w-8 h-8 rounded flex items-center justify-center transition cursor-pointer
            ${isDark ? 'bg-[#25262B] hover:bg-[#33353a]' : 'bg-[#e1e7ee] hover:bg-[#d6dce3]'}`}
          title="Reset Inbox"
        >
          <RotateCw className="w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}" />
        </button>
      </div>

      {/* Inbox selection info */}
      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        25/25 <span className={`${isDark ? 'text-gray-500' : 'text-[#7F7F7F]'}`}>Inboxes selected</span>
      </p>
    </div>
  );
};

export default InboxHeader;
