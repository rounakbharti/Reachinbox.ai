import React from 'react';

interface ReplyPopupProps {
  onClose: () => void;
}

export default function ReplyPopup({ onClose }: ReplyPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-11/12 max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Reply to Mail</h2>
        <textarea
          rows={5}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your reply here"
        ></textarea>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}
