'use client';

import { ThemeProvider } from '@/lib/themeContext';
import '../globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setActiveIcon] = useState<number>(0);

  const handleChange = (index: number) => {
    setActiveIcon(index);
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <Sidebar username="R" handleChange={handleChange} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 h-95vh">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
