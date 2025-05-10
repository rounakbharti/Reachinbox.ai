'use client';

import React from 'react';
import { useTheme } from '@/lib/themeContext';

interface SingleProps {
  subject: string;
  fromEmail: string;
  toEmail: string;
  body: string;
  sentAt: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString()} : ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const cleanHTML = (html: string) => {
  return html
    .replace(/<p>/g, '\n')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .trim();
};

const SingleMail: React.FC<SingleProps> = ({ subject, fromEmail, toEmail, body, sentAt }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`mr-4 p-3 text-[14px] flex flex-col gap-2.5 text-left mb-2 border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between">
        <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{subject}</p>
        <p className="text-[#AEAEAE] mr-8">{formatDate(sentAt)}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className={`text-[#AEAEAE] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>from: {fromEmail}</p>
        <p className={`text-[#AEAEAE] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>to: {toEmail}</p>
      </div>
      <pre
        className={`${
          isDark ? 'text-[#b7abab]' : 'text-[#2a2626]'
        } whitespace-pre-wrap line-clamp-3 overflow-hidden`}
      >
        {cleanHTML(body)}
      </pre>
    </div>
  );
};

export default SingleMail;
