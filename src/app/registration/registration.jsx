'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import loadAvatar from '@/utils/load-avatar';
import AuthInputForm from '@/components/shared/auth-input-form/auth-input-form';
import {
  getAuthError,
  getUser,
} from '@/redux/auth/auth-selectors';
import {
  registerIncognito,
  checkAccessCode,
} from '@/redux/auth/auth-operations';
import { getCopiedAccessCode } from '@/redux/technical/technical-selectors';
import BackLink from '@/components/shared/back-link/back-link';
import Text from '@/components/shared/text/text';
import RoleCheckbox from '@/components/shared/role-checkbox/role-checkbox';
import NavLink from '@/components/shared/navLink/navLink';
import { FaGoogle } from 'react-icons/fa';
import { BsIncognito } from 'react-icons/bs';
import avatarIncognito from '@/images/incognito.png';

const Registration = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const errorRegister = useSelector(getAuthError);
  const copiedAccessCode = useSelector(getCopiedAccessCode);
  const pathname = usePathname();
  const router = useRouter();
  const [currentOrigin, setCurrentOrigin] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(encodeURIComponent(window.location.origin));
    }
  }, []);

  useEffect(() => {
    if (!errorRegister && user?.id && user?.role && copiedAccessCode) {
      const route = user.role === 'doctor' ? '/doctor-dashboard' : '/';
      router.replace(route);
    }
  }, [errorRegister, user.id, user.role, router, copiedAccessCode]);

  const REACT_APP_API_URL =
    'https://test-task-backend-34db7d47d9c8.herokuapp.com';

  const googleText =
    pathname === '/login'
      ? 'Login quickly with Google'
      : 'Sign up quickly with Google';

  const generateUserData = async () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const getRandomChar = () =>
      chars[Math.floor(Math.random() * chars.length)];
    let accessCode = '';
    let password = '';
    let isUnique = false;

    while (!isUnique) {
      const part1 = Array.from({ length: 4 }, getRandomChar).join('');
      const part2 = Array.from({ length: 4 }, getRandomChar).join('');
      accessCode = `${part1}-${part2}`;
      password = (part2 + part1).split('').reverse().join('');

      const res = await dispatch(checkAccessCode({ accessCode }));

      if (res.payload?.uniqueAccessCode === true) {
        isUnique = true;
      }
    }

    const base64Avatar = await loadAvatar(avatarIncognito.src);

    const userData = {
      username: 'Іncognito',
      accessCode,
      password,
      userAvatar: base64Avatar,
      role: isDoctor ? 'doctor' : 'patient',
    };
      return userData;
  };

  const handleIncognitoClick = async () => {
    const userData = await generateUserData();
    dispatch(registerIncognito(userData));
  };

  return (
    <section className="h-[100vh]">
      <div className="w-full md:max-w-[600px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-[rgba(82,85,95,0.1)] shadow-[10px_10px_30px_rgba(82,85,95,0.4)] z-[10] rounded-2xl">
        <div className="w-full flex flex-row justify-around gap-[2px]">
          <div
            className={`w-1/2 rounded-t-xl border border-[rgba(82,85,95,0.2)] flex justify-center items-center py-3 ${
              pathname === '/login' ? 'border-b-0' : ''
            }`}
          >
            <NavLink href="/login" isActive={pathname === '/login'}>
              <Text
                type="small"
                as="p"
                fontWeight="normal"
                className="text-black"
              >
                Login
              </Text>
            </NavLink>
          </div>
          <div
            className={`w-1/2 rounded-t-xl border border-[rgba(82,85,95,0.2)] flex justify-center items-center py-3 ${
              pathname === '/registration' ? 'border-b-0' : ''
            }`}
          >
            <NavLink
              href="/registration"
              isActive={pathname === '/registration'}
            >
              <Text
                type="small"
                as="p"
                fontWeight="normal"
                className="text-black"
              >
                Registration
              </Text>
            </NavLink>
          </div>
        </div>

        <div className="w-full flex flex-row justify-around gap-[3px] pt-10 pb-5 px-6">
          <div className="w-1/2 pr-[10px]">
            <AuthInputForm typeOperation="registration" isDoctor={isDoctor} />
          </div>
          <div className="w-1/2 pl-[10px] flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-5">
              <Text type="tiny" as="p" fontWeight="normal">
                {googleText}
              </Text>
              <a
                href={`${REACT_APP_API_URL}/google?origin=${currentOrigin}${
                  isDoctor ? '&role=doctor' : '&role=patient'
                }`}
                style={{ borderRadius: '5px' }}
                className="
                inline-flex justify-center items-center gap-[5px] mx-auto mb-5  w-[150px] h-[40px] md:w-[170px] regular-border hover-transition group transition-shadow duration-300 hover:shadow-md hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-pointer"
              >
                <span className="text-black group-hover:text-white transition-colors duration-300">
                  <FaGoogle size={20} />
                </span>
                <Text
                  type="tiny"
                  as="span"
                  fontWeight="normal"
                  className="group-hover:text-white hover-transition"
                >
                  Google
                </Text>
              </a>
            </div>
            <div className="flex flex-col items-center gap-5">
              <div data-tooltip-id="incognito-tooltip">
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-center"
                >
                  Or enter incognito without providing personal details
                </Text>
              </div>
              <Tooltip
                id="incognito-tooltip"
                place="top"
                style={{
                  width: '300px',
                  backgroundColor: '#0f1d2d',
                  borderRadius: '5px',
                  padding: '6px 10px',
                  fontSize: '12px',
                }}
              >
                <Text
                  type="extraSmall"
                  as="span"
                  fontWeight="light"
                  className="text-white"
                >
                  Register without providing personal details. A unique access
                  code will be generated for your account — please make sure to
                  save it securely. This code is required to access your account
                  in the future. Although no personal information is stored,
                  your account is fully functional and private.
                </Text>
              </Tooltip>
              <button
                onClick={handleIncognitoClick}
                type="button"
                style={{ borderRadius: '5px' }}
                className="inline-flex justify-center items-center gap-[5px] mx-auto mb-5  w-[150px] h-[40px] md:w-[170px] regular-border hover-transition group transition-shadow duration-300 hover:shadow-md hover:bg-[var(--accent)] hover:border-[var(--accent)] cursor-pointer"
              >
                <span className="text-black group-hover:text-white transition-colors duration-300">
                  <BsIncognito size={22} />
                </span>
                <Text
                  type="tiny"
                  as="span"
                  fontWeight="normal"
                  className="group-hover:text-white hover-transition"
                >
                  Incognito
                </Text>
              </button>
            </div>
            <RoleCheckbox value={isDoctor} onChange={setIsDoctor} />
            <div className="text-center text-wrap">
              <Text
                type="tiny"
                as="span"
                fontWeight="normal"
                lineHeightValues="none"
              >
                By registering on the platform, you automatically agree to
                our{' '}
              </Text>
              <button
                onClick={() => router.push('/terms')}
                className="cursor-pointer underline decoration-transparent marker:underline-offset-2 hover:decoration-[#00f] transition-all duration-300"
                type="button"
              >
                <Text
                  type="tiny"
                  as="span"
                  fontWeight="normal"
                  lineHeightValues="none"
                  className="text-[#00f]"
                >
                  Terms and conditions
                </Text>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center pb-5">
          <BackLink />
        </div>
      </div>
    </section>
  );
};

export default Registration;
