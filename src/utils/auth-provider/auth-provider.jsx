'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLogin } from '@/redux/auth/auth-selectors';
import { getCurrentUser } from '@/redux/auth/auth-operations';
import { setRefreshUserData } from '@/redux/auth/auth-slice';
import { useRouter } from 'next/navigation';
import useSocket from '@/hooks/useSocket';

const AuthProvider = () => {
  const { initialize } = useSocket(); // 👈 Імпортуй ініціалізацію сокета сюди
  const dispatch = useDispatch();
  const navigationRouter = useRouter();
  const isLogin = useSelector(getLogin);
  const authData = useSelector((state) => state.auth);

  // 🔁 Запит користувача при наявності токенів
  useEffect(() => {
    if (
      authData.accessToken &&
      authData.refreshToken &&
      authData.sid &&
      !isLogin
    ) {
      dispatch(
        getCurrentUser({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          sid: authData.sid,
        })
      );
    }
  }, [
    dispatch,
    authData.accessToken,
    authData.refreshToken,
    authData.sid,
    isLogin,
  ]);

  // 🔑 Ініціалізація через URL-параметри
  useEffect(() => {
    const initAuthFromUrl = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');
      const sid = urlParams.get('sid');

      if (accessToken && refreshToken && sid) {
        const authData = { accessToken, refreshToken, sid };
        localStorage.setItem(
          'mental-health.authData',
          JSON.stringify(authData)
        );
        dispatch(setRefreshUserData(authData));
        const response = await dispatch(getCurrentUser(authData));
        const userRole = response?.payload?.user.role;
        if (userRole === 'doctor') {
          navigationRouter.replace('/doctor-dashboard');
        } else {
          navigationRouter.replace('/');
        }
      }
    };

    initAuthFromUrl();
  }, [dispatch, navigationRouter]);

  // 🧠 ✅ ПІДПИСКА на `user-new-message` через сокет
  useEffect(() => {
    if (
      authData?.user?._id &&
      authData.accessToken &&
      authData.refreshToken &&
      authData.sid
    ) {
      initialize(authData.user._id, () => {
        dispatch(
          getCurrentUser({
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            sid: authData.sid,
          })
        );
      });
    }
  }, [
    authData.user?._id,
    authData.accessToken,
    authData.refreshToken,
    authData.sid,
    dispatch,
  ]);

  return null;
};

export default AuthProvider;
