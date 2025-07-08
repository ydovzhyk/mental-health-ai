'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getLogin } from '@/redux/auth/auth-selectors';

// We use this hook to check if the user is authenticated and give access to pages that require authentication.
export function useAuth() {
  const router = useRouter();
  const isLogin = useSelector(getLogin);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isLogin) {
        router.replace('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLogin, router]);

  return isLoading ? null : isLogin;
}
