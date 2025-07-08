'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { getLoadingAuth } from '@/redux/auth/auth-selectors';
import { getLoadingTechnical } from '@/redux/technical/technical-selectors';
import { getLogin } from '@/redux/auth/auth-selectors';
import { getUser } from '@/redux/auth/auth-selectors';
import useSocket from '@/hooks/useSocket';
import LoaderSpinner from '@/components/loader/loader';
import ModalWindow from '@/components/modal-window-message/modal-window-message';
import AccessCodeModal from '@/components/shared/access-code-modal/access-code-modal';
import MediaQuery from '@/utils/media-query/media-query';
import AuthProvider from '@/utils/auth-provider/auth-provider';
import Header from '../components/header/header';
import ChatWidget from '../components/chat-widget/chat-widget';
import { getMessageIncognito } from '@/redux/auth/auth-selectors';
// import Footer from '../components/footer/footer';
import ScrollToTopButton from '@/components/scroll-to-top-btn/scroll-to-top-btn';
import SearchParamsHandler from '@/utils/search-params-handler';

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const loadingAuth = useSelector(getLoadingAuth);
  const loadingTechnical = useSelector(getLoadingTechnical);
  const messageIncognito = useSelector(getMessageIncognito);
  const isLogin = useSelector(getLogin);
  const user = useSelector(getUser);
  const [loading, setLoading] = useState(false);
  const { initialize, disconnect } = useSocket();

  useEffect(() => {
    setLoading(loadingAuth || loadingTechnical);
  }, [loadingAuth, loadingTechnical]);

  useEffect(() => {
    if (isLogin && user && user._id) {
      initialize(user._id);
    } else {
      disconnect();
    }
  }, [isLogin, user?._id]);

  const allowedRoutes = [
    '/',
    '/about',
    '/articles',
    '/user',
    '/add-property',
    '/property',
    'payment/stage-1',
    'payment/stage-2',
    'payment/stage-3',
  ];

  const isAllowedRoute = (pathname) => {
    return allowedRoutes.some(
      route =>
        route === pathname ||
        pathname.startsWith('/articles') ||
        pathname.startsWith('/property') ||
        pathname.startsWith('/payment')
    );
  };

  const showLayoutElements = isAllowedRoute(pathname);

  return (
    <div className="reletive min-h-screen flex flex-col justify-between">
      {loading && <LoaderSpinner />}
      <ModalWindow />
      <MediaQuery />
      <AuthProvider />
      <Suspense fallback={<LoaderSpinner />}>
        <SearchParamsHandler />
      </Suspense>
      {showLayoutElements && <Header />}
      <main className={`flex-1 ${showLayoutElements ? 'mt-[94px]' : ''}`}>
        {children}
      </main>
      <ChatWidget />
      <ScrollToTopButton />
      {/* {showLayoutElements && <Footer />} */}
      {messageIncognito && <AccessCodeModal />}
    </div>
  );
};

export default ClientLayout;

