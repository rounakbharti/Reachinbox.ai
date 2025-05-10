'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('reachinbox-auth');

    if (!token) {
      router.replace('/login');
    } else {
      router.replace('/onebox');
    }
  }, [router]);

  return null;
}
