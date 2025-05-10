'use client';

import { ChevronDown, X, Bold, Italic, Underline, Save, Braces } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { postMailMessages } from '@/services/mailService';
import { generateSmartReplies } from '@/services/aiServices';
import { useTheme } from '@/lib/themeContext';
import { Mail } from '@/types/mailTypes';

interface SendReplyProps {
  handleCancel: () => void;
  singleMail: Mail;
}

interface FormDataType {
  toName: string;
  to: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
}

interface SavedDraft {
  subject: string;
  body: string;
  threadId: number;
}

const initialState: FormDataType = {
  toName: '',
  to: '',
  from: '',
  fromName: '',
  subject: '',
  body: '',
};

const SendReply: React.FC<SendReplyProps> = ({ handleCancel, singleMail }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<FormDataType>(initialState);
  const [token, setToken] = useState<string>('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authToken = localStorage.getItem('reachinbox-auth');
    if (authToken) {
      setToken(JSON.parse(authToken));
    }
  
    const savedDrafts = localStorage.getItem('email-drafts');
    if (savedDrafts) {
      const drafts: SavedDraft[] = JSON.parse(savedDrafts);
      const matchingDraft = drafts.find(draft => draft.threadId === singleMail.threadId);
      if (matchingDraft && editorRef.current) {
        setFormData(prev => ({
          ...prev,
          subject: matchingDraft.subject,
          body: matchingDraft.body,
        }));
        editorRef.current.innerHTML = matchingDraft.body;
      }
    }
  
    setFormData(prev => ({
      ...prev,
      toName: singleMail.toName,
      to: singleMail.toEmail,
      from: singleMail.fromEmail,
      fromName: singleMail.fromEmail,
      subject: `Re: ${singleMail.subject}`,
    }));
  
    const fetchSmartReplies = async () => {
      if (smartReplies.length === 0) {  
        setLoadingReplies(true);
        const threadBody = singleMail.body || '';
        const suggestions = await generateSmartReplies(threadBody);
        setSmartReplies(suggestions);
        setLoadingReplies(false);
      }
    };
  
    fetchSmartReplies();
  }, [singleMail, smartReplies]);
  

  const handleSubmit = () => {
    if (!token) {
      alert('Token not found. Please log in again.');
      return;
    }

    postMailMessages(singleMail.threadId, formData)
      .then(() => {
        alert('Reply has been sent.');
        clearSavedDraft(singleMail.threadId);
        handleCancel();
      })
      .catch(console.error);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const draft: SavedDraft = {
        subject: formData.subject,
        body: editorRef.current.innerHTML,
        threadId: singleMail.threadId,
      };

      const existingDrafts = localStorage.getItem('email-drafts');
      let drafts: SavedDraft[] = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts = drafts.filter(d => d.threadId !== singleMail.threadId);
      drafts.push(draft);
      localStorage.setItem('email-drafts', JSON.stringify(drafts));
      alert('Draft saved successfully!');
    }
  };

  const clearSavedDraft = (threadId: number) => {
    const existingDrafts = localStorage.getItem('email-drafts');
    if (existingDrafts) {
      let drafts: SavedDraft[] = JSON.parse(existingDrafts);
      drafts = drafts.filter(d => d.threadId !== threadId);
      localStorage.setItem('email-drafts', JSON.stringify(drafts));
    }
  };

  const insertVariable = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      insertTextAtCursor('{{firstName}}');
    }
  };

  const insertTextAtCursor = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleSmartReplyClick = (reply: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `<p>${reply}</p>`;
      setFormData(prev => ({ ...prev, body: `<p>${reply}</p>` }));
    }
  };

  const inputStyle = `outline-none px-3 py-1 rounded w-full ${isDark ? 'bg-[#141517] text-white' : 'bg-white text-black'}`;

  return (
    <div className="flex flex-col w-full">
      <div>
        <div
          className={`h-12 flex justify-between items-center px-6 py-2 text-[16px] font-semibold ${
            isDark ? 'bg-[#1F1F22]' : 'bg-[#F3F4F6]'
          }`}
        >
          <p>Reply</p>
          <p onClick={handleCancel} className="cursor-pointer hover:opacity-80">
            <X />
          </p>
        </div>
        <hr className="border-t border-gray-700" />
        <div className="text-[12px] h-10 flex items-center gap-2 pt-2 px-8">
          <p className="text-gray-400">To:</p>
          <input
            type="text"
            value={formData.to}
            className={inputStyle}
            onChange={e => setFormData({ ...formData, to: e.target.value })}
          />
        </div>
        <hr className="border-t border-gray-700" />
        <div className="text-[12px] h-10 flex items-center gap-2 pt-2 px-8">
          <p className="text-gray-400">From:</p>
          <input
            type="text"
            value={formData.from}
            className={inputStyle}
            onChange={e => setFormData({ ...formData, from: e.target.value })}
          />
        </div>
        <hr className="border-t border-gray-700" />
        <div className="text-[12px] h-10 flex items-center gap-2 pt-2 px-8">
          <p className="text-gray-400">Subject:</p>
          <input
            type="text"
            value={formData.subject}
            className={inputStyle}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <hr className="border-t border-gray-700" />

        {/* Smart Reply Suggestions */}
        <div className="px-8 py-2">
          <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Smart Reply Suggestions (Powered by ReachInbox AI):
          </p>
          {loadingReplies ? (
            <p className="text-xs text-gray-500">Loading suggestions...</p>
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {smartReplies.map((reply, index) => (
                <button
                  key={index}
                  className={`text-xs px-3 py-1 rounded-full border cursor-pointer hover:bg-opacity-80 transition ${
                    isDark
                      ? 'bg-[#2C2F34] text-white border-gray-600 hover:bg-[#3A3D42]'
                      : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handleSmartReplyClick(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-[12px]">
          <div className="editor-container rounded">
            <div className={`toolbar flex gap-2 p-2 rounded-t ${isDark ? 'bg-[#1F1F22]' : 'bg-[#E5E7EB]'}`}>
              {[{ icon: <Bold size={16} />, action: () => document.execCommand('bold'), title: 'Bold' },
                { icon: <Italic size={16} />, action: () => document.execCommand('italic'), title: 'Italic' },
                { icon: <Underline size={16} />, action: () => document.execCommand('underline'), title: 'Underline' },
                { icon: <Save size={16} />, action: handleSave, title: 'Save' },
                { icon: <Braces size={16} />, action: insertVariable, title: 'Insert Variable' }]
                .map((btn, index) => (
                  <button
                    key={index}
                    className={`p-1 rounded hover:opacity-80 transition ${
                      isDark ? 'hover:bg-[#2C2F34] text-white' : 'hover:bg-gray-300 text-black'
                    }`}
                    onClick={btn.action}
                    title={btn.title}
                  >
                    {btn.icon}
                  </button>
                ))}
            </div>

            <div
              ref={editorRef}
              contentEditable
              className={`h-[200px] w-full ${inputStyle} p-2 overflow-y-auto`}
              onInput={e => setFormData({ ...formData, body: e.currentTarget.innerHTML })}
            />
          </div>
        </div>
      </div>

      <div className="h-[60px] w-full">
        <hr className="border-t border-gray-700 mb-2" />
        <div className="flex text-[12px] gap-3 px-6">
          <div
            className="w-[110px] h-9 bg-[#4B63DD] hover:bg-[#3A50C2] transition-colors duration-150 flex justify-center items-center rounded cursor-pointer"
            onClick={handleSubmit}
          >
            <button className="text-white mr-1 cursor-pointer">Send</button>
            <ChevronDown color="white" size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendReply;
