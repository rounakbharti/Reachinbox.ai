'use client';

import { ChevronLeft, ChevronRight, Paperclip, ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import { Mail } from '@/types/mailTypes';

interface ThreadTimelineProps {
  mails: Mail[];
  isDark: boolean;
  showTimeline: boolean;
  onToggle: () => void;
  onTimelineClick: (mailId: number) => void;
}

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ThreadTimeline: React.FC<ThreadTimelineProps> = ({ mails, isDark, showTimeline, onToggle, onTimelineClick }) => {
  return (
    <>
      <div
        className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
          showTimeline ? 'w-64' : 'w-0'
        } overflow-hidden ${isDark ? 'bg-[#1a1c1e]' : 'bg-gray-50'} border-l ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } shadow-lg`}
      >
        <div className="p-4 h-full flex flex-col overflow-x-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-md font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Thread Timeline
            </h2>
            <button
              onClick={onToggle}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="relative">
              {mails.map((mail) => {
                const isReply = !!mail.inReplyTo;
                const hasAttachment = mail.body.includes('<attachment>');
                const icon = isReply ? (
                  <ArrowRight size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                ) : hasAttachment ? (
                  <Paperclip size={14} className={isDark ? 'text-green-400' : 'text-green-600'} />
                ) : (
                  <ArrowLeft size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                );

                return (
                  <div
                    key={mail.id}
                    className={`relative mb-8 group cursor-pointer ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    } rounded-lg p-3 transition-all duration-200 transform hover:scale-105`}
                    onClick={() => onTimelineClick(mail.id)}
                  >
                    <div
                      className={`absolute left-2 top-4 w-4 h-4 rounded-full z-10 ${
                        isReply ? (isDark ? 'bg-blue-400' : 'bg-blue-600') :
                        hasAttachment ? (isDark ? 'bg-green-400' : 'bg-green-600') :
                        (isDark ? 'bg-gray-400' : 'bg-gray-600')
                      } shadow-md`}
                    />
                    <div className="ml-6">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatTimestamp(mail.sentAt)}
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                        {isReply ? 'Reply' : hasAttachment ? 'Attachment' : 'Sent'} • {mail.fromName}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                        <span className="font-semibold">{mail.subject}:</span>{' '}
                        {mail.body.replace(/<[^>]+>/g, '').slice(0, 30)}...
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {!showTimeline && (
        <button
          onClick={onToggle}
          className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-2 rounded-l-md ${
            isDark ? 'bg-[#222426] text-white' : 'bg-white text-gray-600'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-90 transition-all`}
        >
          <ChevronLeft size={18} />
        </button>
      )}
    </>
  );
};

export default ThreadTimeline;