'use client';

import React from 'react';
import { Mail } from '@/types/mailTypes';

interface MailSummaryProps {
  mail: Mail;
  onExpand: (mailId: number) => void;
  isDark: boolean;
  summary: string;
}

const MailSummary: React.FC<MailSummaryProps> = ({ mail, onExpand, isDark, summary }) => {
  return (
    <div
      className={`mr-4 p-3 text-[14px] flex flex-col gap-2.5 text-left mb-2 border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } cursor-pointer hover:bg-opacity-90 transition-all`}
      onClick={() => onExpand(mail.id)} 
    >
      <pre
        className={`${
          isDark ? 'text-[#b7abab]' : 'text-[#2a2626]'
        } whitespace-pre-wrap line-clamp-3 overflow-hidden`}
      >
        {summary}
      </pre>
    </div>
  );
};

export default MailSummary;