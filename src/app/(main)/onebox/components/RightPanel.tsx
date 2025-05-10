'use client';

import { Mail, Send, MailOpen } from 'lucide-react';
import { useTheme } from '@/lib/themeContext';

const RightPanel: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const steps = [
    {
      status: 'Sent',
      date: '3rd, Feb',
      icon: <Send size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />,
    },
    {
      status: 'Opened',
      date: '5th, Feb',
      icon: <MailOpen size={14} className="text-yellow-400" />,
    },
    {
      status: 'Opened',
      date: '5th, Feb',
      icon: <MailOpen size={14} className="text-yellow-400" />,
    },
  ];

  return (
    <div className="w-full text-sm">
      {/* Lead Details Header */}
      <div
        className={`w-full h-8 mb-5 border rounded ${
          isDark ? 'bg-[#3d3e42] border-gray-500' : 'bg-gray-200 border-gray-400'
        }`}
      >
        <p className={`ml-3 mt-[6px] text-[15px] ${isDark ? 'text-white' : 'text-black'}`}>
          Lead Details
        </p>
      </div>

      {/* Lead Details Info */}
      <div className="flex flex-col gap-4 text-[12px]">
        {[
          ['Name', 'Orlando'],
          ['Contact No', '+53 4245252354'],
          ['Email ID', 'orladom@gmail.com'],
          ['Linkedin', 'linkedin.com/in/timvadde/'],
          ['Company Name', 'Reachinbox'],
        ].map(([label, value], i) => (
          <div key={i} className="flex justify-between mx-3">
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</p>
            <p className={isDark ? 'text-white' : 'text-black'}>{value}</p>
          </div>
        ))}
      </div>

      {/* Activities Header */}
      <div
        className={`w-full h-8 mt-6 mb-3 border rounded ${
          isDark ? 'bg-[#3d3e42] border-gray-500' : 'bg-gray-200 border-gray-400'
        }`}
      >
        <p className={`ml-3 mt-[6px] text-[15px] ${isDark ? 'text-white ' : 'text-black'}`}>
          Activities
        </p>
      </div>

      {/* Campaign Info */}
      <div className="ml-2 mt-6">
        <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
          Campaign Name
        </h2>
        <div className={`flex gap-4 mt-2 text-[12px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="border-r pr-3 border-gray-600">3 Steps</div>
          <div>5 Days in Sequence</div>
        </div>
      </div>

      {/* Email Timeline */}
      <div className="mt-6 ml-1 relative">
        {steps.map((step, index) => (
          <div key={index} className="relative pl-5 flex gap-4 items-start mb-6">
            {/* Timeline circle + line */}
            <div className="relative">
              {/* Vertical line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-1/2 top-9 h-full w-px bg-gray-600 -translate-x-1/2" />
              )}
              {/* Dot */}
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center border ${
                  isDark
                    ? 'bg-[#3d3e42] border-gray-500'
                    : 'bg-gray-200 border-gray-400'
                } z-10 relative`}
              >
                <Mail size={16} className={isDark ? 'text-white' : 'text-black'} />
              </div>
            </div>

            {/* Step Info */}
            <div>
              <div className={`${isDark ? 'text-white' : 'text-black'} text-sm font-medium mb-1`}>
                Step {index + 1}: Email
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {step.icon}
                <span>
                  {step.status}{' '}
                  <span className={`font-semibold ml-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {step.date}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;
