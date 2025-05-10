'use client';

import { ChevronDown } from 'lucide-react';
import InboxHeader from './inbox/InboxHeader';
import SearchBar from './inbox/SearchBar';
import InboxEmailCard from './inbox/InboxEmailCard';
import { useTheme } from '@/lib/themeContext';

interface Email {
  id: number;
  fromEmail: string;
  subject: string;
  threadId: number;
}

interface LeftPanelProps {
  handleChangeEmail: (threadId: number) => void;
  selectedThreadId: number | null;
  emails: Email[];
}

const LeftPanel: React.FC<LeftPanelProps> = ({ handleChangeEmail, selectedThreadId, emails }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lineColor = isDark ? '#444' : '#ddd';

  return (
    <div className="flex-shrink-0 p-4 flex flex-col">
      <InboxHeader />
      <div className="mt-2">
        <SearchBar />
      </div>
      <div className="flex justify-between text-sm mt-3">
        <div className="flex items-center gap-2">
          <p className="text-blue-500 w-8 h-7 pt-0.5 text-center rounded-2xl bg-[#e1e7ee]">26</p>
          <p>New Replies</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Newest</p>
          <ChevronDown />
        </div>
      </div>
      <hr className="mt-2.5" style={{ borderColor: lineColor }} />
      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <div key={email.id}>
            <InboxEmailCard
              {...email}
              handleChangeEmail={handleChangeEmail}
              isSelected={selectedThreadId === email.threadId}
            />
            <hr className="border-gray-300" style={{ borderColor: lineColor }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
