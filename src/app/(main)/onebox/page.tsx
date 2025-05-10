'use client';

import React, { useEffect, useState, useCallback } from 'react';
import LeftPanel from './components/LeftPanel';
import MiddlePanel from './components/MiddlePanel';
import RightPanel from './components/RightPanel';
import ReplyPopup from './components/ReplyPopup';
import { jwtDecode } from 'jwt-decode';
import DeletePopup from './components/DeletePopup';
import ShortcutPopup from '@/components/ShortcutPopup';
import { getMailList } from '@/services/mailService';
import { Loader2 } from 'lucide-react';
import EmptyEmailSection from '@/components/EmptyEmailSection';
import { useTheme } from '@/lib/themeContext';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface ParsedData {
  user: User;
}

interface Email {
  id: number;
  fromEmail: string;
  subject: string;
  threadId: number;
}

export default function OneboxPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [renderToggle, setRenderToggle] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem('reachinbox-auth');
    const tokenFromURL = location.search.split('?token=')?.[1];
  
    if (tokenFromURL) {
      token = tokenFromURL;
      try {
        const parsedData: ParsedData = jwtDecode(token);
        localStorage.setItem('reachinbox-auth', JSON.stringify(token));
        localStorage.setItem('reachinbox-auth-firstname', JSON.stringify(parsedData.user.firstName));
        localStorage.setItem('reachinbox-auth-lastname', JSON.stringify(parsedData.user.lastName));
        localStorage.setItem('reachinbox-auth-email', JSON.stringify(parsedData.user.email));
        document.cookie = `auth=true; path=/`;
      } catch (err) {
        console.error('Invalid token from URL:', err);
      }
    } else if (token) {
      document.cookie = `auth=true; path=/`;
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getMailList();
        setEmails(res);
        setLoading(false);

        if (res?.length > 0 && selectedThreadId === null) {
          const firstThreadId = res[0]?.threadId;
          if (firstThreadId !== undefined) {
            setSelectedThreadId(firstThreadId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch inbox:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [renderToggle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === 'Escape') {
        setShowReply(false);
        setShowDelete(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChangeEmail = useCallback((threadId: number) => {
    setSelectedThreadId(threadId);
  }, []);

  const handleDeleteSuccess = () => {
    setRenderToggle((prev) => !prev);
  };

  const lineColor = isDark ? '#444' : '#ddd';

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full gap-3 text-gray-600 dark:text-gray-300">
          <Loader2 className="animate-spin w-6 h-6" />
          <span className="text-base font-medium">Fetching Mails...</span>
        </div>
      ) : emails.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-48 h-48 opacity-80 dark:opacity-60">
            <EmptyEmailSection />
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex-[2.5] pr-4 h-full overflow-y-auto"
            style={{ borderRight: `1px solid ${lineColor}` }}
          >
            <LeftPanel
              handleChangeEmail={handleChangeEmail}
              selectedThreadId={selectedThreadId}
              emails={emails}
            />
          </div>

          <div
            className="flex-[6.5] h-full overflow-y-auto"
            style={{ borderRight: `1px solid ${lineColor}` }}
          >
            <MiddlePanel
              selectedThreadId={selectedThreadId}
              refresh={renderToggle}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>

          <div className="flex-[2] p-4 h-full overflow-y-auto">
            <RightPanel />
          </div>
        </>
      )}

      {showReply && <ReplyPopup onClose={() => setShowReply(false)} />}
      {showDelete && selectedThreadId !== null && (
        <DeletePopup
          onClose={() => setShowDelete(false)}
          theme="light"
          threadId={selectedThreadId}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      {showShortcuts && <ShortcutPopup onClose={() => setShowShortcuts(false)}  theme="light"/>}
    </div>
  );
}
