'use client';

import { ChevronDown, Reply, Loader2, ChevronLeft, ChevronRight, Paperclip, ArrowLeft, ArrowRight, ChevronUp, List, Eye } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import SingleMail from './reply/SingleMail';
import SendReply from './reply/SendReply';
import { useTheme } from '@/lib/themeContext';
import { getMailMessages } from '@/services/mailService';
import DeletePopup from './DeletePopup';
import { Mail } from '@/types/mailTypes';
import MailSummary from './reply/MailSummary';
import { summarizeMail } from '@/services/aiServices';

interface MiddlePannelProps {
  selectedThreadId: number | null;
  onDeleteSuccess: () => void;
  refresh: boolean;
}

const formatGroupDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
};

const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MiddlePannel: React.FC<MiddlePannelProps> = ({ selectedThreadId, onDeleteSuccess }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showReply, setShowReply] = useState(false);
  const [singleMail, setSingleMail] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');
  const [expandedMails, setExpandedMails] = useState<number[]>([]);
  const [mailSummaries, setMailSummaries] = useState<{ [key: number]: string }>({});
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); 

  useEffect(() => {
    if (selectedThreadId !== null) {
      setLoading(true);
      getMailMessages(selectedThreadId)
        .then((messages: Mail[]) => {
          setSingleMail(messages);
          Promise.all(
            messages.map((mail) =>
              summarizeMail({
                fromName: mail.fromName,
                sentAt: mail.sentAt,
                body: mail.body,
              }).catch(() => `${mail.fromName} ${formatTimestamp(mail.sentAt)}: ${mail.body.slice(0, 20)}...`)
            )
          ).then((summaries) => {
            const summaryMap = messages.reduce((acc, mail, index) => {
              acc[mail.id] = summaries[index];
              return acc;
            }, {} as { [key: number]: string });
            setMailSummaries(summaryMap);
            setLoading(false);
          });
        })
        .catch((error) => {
          console.error('Error fetching messages for thread:', error);
          setLoading(false);
        });
    }
  }, [selectedThreadId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      if (key === 'r' && !isCtrlPressed) setShowReply(true);
      else if (key === 'd' && !showReply) setShowDeletePopup(true);
      else if (key === 't' && !showReply) setShowTimeline((prev) => !prev);
      else if (key === 's' && !showReply) setViewMode((prev) => (prev === 'detailed' ? 'summary' : 'detailed'));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReply]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full gap-3 text-gray-600 dark:text-gray-300">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="text-base font-medium">Fetching Thread...</span>
      </div>
    );
  }

  const groupedMails = singleMail.reduce((acc: { [key: string]: Mail[] }, mail: Mail) => {
    const groupLabel = formatGroupDate(mail.sentAt);
    if (!acc[groupLabel]) acc[groupLabel] = [];
    acc[groupLabel].push(mail);
    return acc;
  }, {});

  const latestMail = singleMail[singleMail.length - 1] || {};

  const handleTimelineClick = (mailId: number) => {
    const element = messageRefs.current[mailId];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleExpand = (mailId: number) => {
    setExpandedMails((prev) => [...prev, mailId]);
  };

  const handleCollapse = (mailId: number) => {
    setExpandedMails((prev) => prev.filter((id) => id !== mailId));
  };

  return (
    <div className="h-[630px] flex relative">
      <div className="flex flex-col flex-grow">
        <header className={`flex h-[70px] py-3 pl-4 ${isDark ? 'bg-[#222426]' : 'bg-white'}`}>
          <div className="text-left w-full">
            <h1 className="text-sm">{singleMail?.[0]?.fromName || 'No Sender'}</h1>
            <p className="text-xs text-gray-400">{singleMail?.[0]?.toEmail || 'No Recipient'}</p>
          </div>
          <div className="flex justify-end mr-6 gap-4 h-8 my-2 w-full">
            <div className={`flex items-center gap-2 p-2 border border-gray-700 rounded ${isDark ? 'bg-[#222426]' : 'bg-white'}`}>
              <span className="w-3 h-3 rounded-full bg-yellow-600" />
              <span className="text-xs">Meeting Completed</span>
              <ChevronDown size={14} />
            </div>
            <div className={`flex items-center gap-1 p-2 border border-gray-700 rounded ${isDark ? 'bg-[#222426]' : 'bg-white'}`}>
              <span className="text-xs">Move</span>
              <ChevronDown size={14} />
            </div>
            <div className={`flex items-center p-2 border border-gray-700 rounded ${isDark ? 'bg-[#222426]' : 'bg-white'}`}>
              <span className="text-lg leading-none">…</span>
            </div>
          </div>
        </header>

        <hr className={`border-${isDark ? 'gray-600' : 'gray-300'}`} />

        <section
          className={`pl-4 pr-2 overflow-y-auto flex-grow scrollbar-thin ${
            isDark ? 'scrollbar-thumb-gray-600 scrollbar-track-[#1f1f1f]' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          }`}
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          {Object.entries(groupedMails).map(([dateLabel, mails]: [string, Mail[]]) => (
            <div key={dateLabel}>
              <div className="relative my-4 flex items-center justify-center">
                <div className={`h-px w-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'} absolute left-0`} />
                <span
                  className={`relative z-10 px-4 py-1 text-xs rounded-full border ${
                    isDark ? 'bg-[#141517] text-white border-gray-700' : 'bg-white text-black border-gray-300'
                  }`}
                >
                  {dateLabel}
                </span>
              </div>
              {mails.map((mail: Mail) => (
               <div
               key={mail.id}
               ref={(el) => {
                 messageRefs.current[mail.id] = el;
               }}
             >

                  {viewMode === 'detailed' || expandedMails.includes(mail.id) ? (
                    <div className="relative">
                      <SingleMail {...mail} />
                      {viewMode === 'summary' && (
                        <button
                          onClick={() => handleCollapse(mail.id)}
                          className={`absolute top-2 right-6 p-1 rounded-full cursor-pointer ${
                            isDark
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-200 text-black hover:bg-gray-300'
                          } transition-all`}
                          title="Collapse"
                        >
                          <ChevronUp size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <MailSummary
                      mail={mail}
                      onExpand={handleExpand}
                      isDark={isDark}
                      summary={mailSummaries[mail.id] || 'Loading summary...'}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          {Object.keys(groupedMails).length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center text-gray-500">No messages found for this thread.</div>
            </div>
          )}
        </section>

        <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />

        {showReply && (
          <div
            className={`absolute mt-[30px] w-[800px] ml-8 rounded-2xl z-10 overflow-hidden border border-gray-700 ${
              isDark ? 'bg-[#141517]' : 'bg-white'
            }`}
            style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' }}
          >
            <div className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
            <SendReply singleMail={latestMail} handleCancel={() => setShowReply(false)} />
          </div>
        )}
      </div>

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
              onClick={() => setShowTimeline(false)}
              className={`p-1 rounded-full ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="relative">
              {singleMail.map((mail) => {
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
                    onClick={() => handleTimelineClick(mail.id)}
                  >
                    <div
                      className={`absolute left-2 top-4 w-4 h-4 rounded-full z-10 ${
                        isReply
                          ? isDark
                            ? 'bg-blue-400'
                            : 'bg-blue-600'
                          : hasAttachment
                          ? isDark
                            ? 'bg-green-400'
                            : 'bg-green-600'
                          : isDark
                          ? 'bg-gray-400'
                            : 'bg-gray-600'
                      } shadow-md`}
                    />
                    <div className="ml-6">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatTimestamp(mail.sentAt)}
                        </span>
                      </div>
                      <p
                        className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}
                      >
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
          onClick={() => setShowTimeline(true)}
          className={`absolute top-1/2 right-0 transform -translate-y-1/2 p-2 rounded-l-md ${
            isDark ? 'bg-[#222426] text-white' : 'bg-white text-gray-600'
          } border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-90 transition-all`}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      <footer className="flex items-center justify-between w-full px-4 py-2 absolute bottom-0">
        <div className="flex gap-4">
          <div
            className="w-[100px] h-10 bg-[#4B63DD] flex items-center justify-center rounded cursor-pointer"
            onClick={() => setShowReply(!showReply)}
          >
            <Reply color="white" size={16} />
            <button className="text-white ml-1 text-sm">Reply</button>
          </div>
          <button
  onClick={() => setViewMode(viewMode === 'detailed' ? 'summary' : 'detailed')}
  className={`w-10 h-10 flex items-center justify-center rounded-full ${
    isDark
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-200 text-black hover:bg-gray-300'
  }`}
  title={viewMode === 'detailed' ? 'Switch to Summaries' : 'Switch to Detailed'}
  aria-label={viewMode === 'detailed' ? 'Show summaries' : 'Show detailed'}
>
  {viewMode === 'detailed' ? (
    <List size={18} />
  ) : (
    <Eye size={18} />
  )}
</button>
        </div>
      </footer>

      {showDeletePopup && singleMail[0]?.threadId && (
        <DeletePopup
          onClose={() => setShowDeletePopup(false)}
          theme={theme}
          threadId={singleMail[0].threadId}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}
    </div>
  );
};

export default MiddlePannel;