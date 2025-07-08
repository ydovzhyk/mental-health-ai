'use client';

import { useEffect, useState } from 'react';
import AuthInfo from './auth-info/auth-info';
import Navigation from './navigation/navigation';
import Logo from '../shared/logo/logo';
import TranslateMe from '@/utils/translating/translating';
import clsx from 'clsx';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'backdrop-blur-md bg-white bg-opacity-50 shadow'
          : 'backdrop-blur-md bg-white bg-opacity-50 shadow'
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo width={170} height={70} />

        <div className="flex-1 flex justify-center">
          <Navigation />
        </div>
        <TranslateMe />
        <div className="flex items-center justify-center pl-8 pr-4">
          <AuthInfo />
        </div>
      </div>
    </header>
  );
};

export default Header;
