'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Mail } from '@/types/mailTypes';
import { summarizeThread } from '@/services/aiServices';

interface ThreadSummaryWidgetProps {
  mails: Mail[];
  isDark: boolean;
}

const ThreadSummaryWidget: React.FC<ThreadSummaryWidgetProps> = ({ mails, isDark }) => {
  const [summary, setSummary] = useState<string>('');
  const [showSummary, setShowSummary] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (mails.length > 0) {
      setLoadingSummary(true);
      fetchSummary(mails);
    }
  }, [mails]);

  const fetchSummary = async (thread: Mail[]) => {
    try {
      const summaryText = await summarizeThread(thread);
      setSummary(summaryText);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setSummary(
        thread.map((m) => `${m.fromName} ${m.sentAt.split(' ')[0]}: ${m.body.slice(0, 20)}`).join('; ')
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!summary && !loadingSummary) return null;

  return (
    <div
      className={`sticky top-0 z-10 ${
        isDark ? 'bg-[#222426] text-white' : 'bg-gray-100 text-black'
      } p-3 rounded-lg shadow-md mx-4 mt-2`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Thread Summary</h3>
        <button onClick={() => setShowSummary(!showSummary)}>
          <ChevronDown size={16} className={`${showSummary ? 'rotate-180' : ''} transition-transform`} />
        </button>
      </div>
      {showSummary && (
        <div className="mt-2">
          {loadingSummary ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              <span className="text-xs">Generating summary...</span>
            </div>
          ) : (
            <p className="text-xs">{summary}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreadSummaryWidget;