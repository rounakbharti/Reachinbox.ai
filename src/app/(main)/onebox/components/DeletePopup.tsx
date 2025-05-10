import React, { useState } from 'react';
import { deleteMailResponse } from '@/services/mailService'; 

interface DeletePopupProps {
  onClose: () => void;
  threadId: number; 
  theme: 'light' | 'dark';
  onDeleteSuccess?: () => void; 
}

export default function DeletePopup({ onClose, threadId, theme, onDeleteSuccess }: DeletePopupProps) {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);

  const deleteEmail = async () => {
    setLoading(true);
    try {
      await deleteMailResponse(threadId); 
      alert(`Thread ${threadId} has been successfully deleted.`);
      onClose();               
      onDeleteSuccess?.();     
    } catch (err) {
      alert("Error deleting email. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDark ? 'bg-[white]/60' : 'bg-[black]/60'} fixed inset-0 z-30 flex items-center justify-center`}>
      <div className={`${isDark ? 'bg-[#1F1F1F] text-white' : 'bg-white text-gray-900'} rounded-xl shadow-lg w-full max-w-md p-8`}>
        <h1 className="text-2xl font-semibold text-center">Are you sure?</h1>
        <p className={`mt-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Your selected email will be permanently deleted.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            className={`w-[110px] h-11 rounded-lg transition cursor-pointer ${
              isDark ? 'bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="w-[120px] h-11 cursor-pointer rounded-lg bg-[#FA5252] hover:bg-[#e04343] text-white transition flex items-center justify-center"
            onClick={deleteEmail}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
