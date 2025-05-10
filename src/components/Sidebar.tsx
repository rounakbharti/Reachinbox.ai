'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BarChart2,
  Home,
  InboxIcon,
  List,
  Mail,
  Send,
  UserRoundSearchIcon,
} from 'lucide-react';
import { useState } from 'react';
import Icon from './Icon';
import { useTheme } from '@/lib/themeContext';

interface SidebarProps {
  username: string;
  showEmailDesktop?: number;
  handleChange: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ username, handleChange }) => {
  const router = useRouter();
  const [activeIcon, setActiveIcon] = useState<number>(5);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const iconColor = isDark ? '#ffffff' : '#000000'; 
  const inactiveIconColor = isDark ? '#888' : '#666'; 
  const lineColor = isDark ? '#444' : '#ddd'; 

  const routes = [
    '/home',
    '/search',
    '/mail',
    '/send',
    '/list',
    '/onebox',
    '/chart',
  ];

  const handleIconClick = (index: number) => {
    setActiveIcon(index);
    handleChange(index);
    router.push(routes[index]);
  };

  return (
    <div
      className={`h-full flex flex-col justify-between px-1 transition-colors border-r`}
      style={{ borderColor: lineColor }} 
    >
      <div>
        <div className="w-12 h-[70px] flex justify-center items-center">
          <Image
            src="https://media.licdn.com/dms/image/D560BAQEmo1aZIhVtlQ/company-logo_200_200/0/1700158687336/reachinbox_ai_logo?e=2147483647&v=beta&t=2eGcwWsFtdBcUVJGGHkBxWHYFN86D-c5zfyr4s3DsNw"
            alt="logo"
            width={24}
            height={24}
            className="w-6 h-6 rounded"
          />
        </div>

        <div className="pt-12 px-2 flex flex-col gap-8">
          {[Home, UserRoundSearchIcon, Mail, Send, List, InboxIcon, BarChart2].map(
            (IconComponent, index) => (
              <Icon
                key={index}
                currColor={isDark}
                isActive={activeIcon === index}
                onClick={() => handleIconClick(index)}
              >
                <IconComponent color={activeIcon === index ? iconColor : inactiveIconColor} />
              </Icon>
            )
          )}
        </div>
      </div>

      <div className="w-12 h-[70px] flex justify-center items-center">
        <p className="w-8 bg-green-900 h-8 rounded-3xl text-white pl-1">
          {username}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
