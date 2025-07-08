'use client';
import { Suspense, useState, useEffect } from 'react';
import Login from './login';
import Logo from '@/components/shared/logo/logo';
import { useMediaQuery } from 'react-responsive';
import LoaderSpinner from '@/components/loader/loader';

export default function LoginPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isMobile = useMediaQuery({ maxWidth: 425 });
  const isTablet = useMediaQuery({ minWidth: 426, maxWidth: 1279 });
  // const isDesktop = useMediaQuery({ minWidth: 1280 });

  if (!hasMounted) return null;

  const backgroundImage = isMobile
    ? '/images/bg-login/login-bg-mobile.webp'
    : isTablet
      ? '/images/bg-login/login-bg-tablet.webp'
      : '/images/bg-login/login-bg-desktop.webp';

  return (
    <div
      className="bg-cover bg-no-repeat h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {!isMobile && (
        <div className="absolute top-[30px] left-[40px]">
          <Logo width={170} height={70} />
        </div>
      )}
      <div className="container">
        <Suspense fallback={<LoaderSpinner />}>
          <Login />
        </Suspense>
      </div>
    </div>
  );
}
