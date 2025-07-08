'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import AuthInputForm from '@/components/shared/auth-input-form/auth-input-form';
import { getLogin, getUser } from '@/redux/auth/auth-selectors';
import { loginIncognito } from '@/redux/auth/auth-operations';
import BackLink from '@/components/shared/back-link/back-link';
import Text from '@/components/shared/text/text';
import NavLink from '@/components/shared/navLink/navLink';
import { fields } from '@/components/shared/text-field/fields';
import TextField from '@/components/shared/text-field/text-field';
import { useTranslate } from '@/utils/translating/translating';
import { FaGoogle } from 'react-icons/fa';
import { BsIncognito } from 'react-icons/bs';

const Login = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector(getLogin);
  const user = useSelector(getUser);
  const pathname = usePathname();
  const router = useRouter();
  const [currentOrigin, setCurrentOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentOrigin(encodeURIComponent(window.location.origin));
    }
  }, []);

  useEffect(() => {
    if (isLogin && user?._id && user?.role) {
      const route = user.role === 'doctor' ? '/doctor-dashboard' : '/';
      router.replace(route);
    }
  }, [isLogin, user.id, user.role, router]);

  const REACT_APP_API_URL =
    'https://test-task-backend-34db7d47d9c8.herokuapp.com';

  const googleText =
    pathname === '/login'
      ? 'Login quickly with Google'
      : 'Sign up quickly with Google';


  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      accessCode: '',
    },
  });

  const onSubmit = async data => {
    const [part1, part2] = data.accessCode.split('-');
    const password = (part2 + part1).split('').reverse().join('');
    const userData = { ...data, password };
    dispatch(loginIncognito(userData));
    reset({ accessCode: '' });
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
            <AuthInputForm typeOperation="login" />
          </div>
          <div className=" w-1/2 pl-[10px] flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-6">
              <Text type="tiny" as="p" fontWeight="normal">
                {googleText}
              </Text>
              <a
                href={`${REACT_APP_API_URL}/google?origin=${currentOrigin}`}
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

            <div className="w-full flex flex-col items-center gap-6">
              <div data-tooltip-id="enter-code-tooltip">
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-center"
                >
                  Already have an access code?
                </Text>
              </div>
              <Tooltip
                id="enter-code-tooltip"
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
                  Enter your previously saved incognito access code to restore
                  your session. If you lost the code or cleared your browser
                  data, access cannot be recovered.
                </Text>
              </Tooltip>

              <form
                className="w-full flex flex-col items-center gap-10 mb-[-15px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  control={control}
                  name="accessCode"
                  rules={{
                    required: useTranslate('Access Code is required'),
                    pattern: {
                      value: /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/,
                      message: useTranslate(
                        'Access Code must be in format XXXX-YYYY'
                      ),
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <TextField
                      value={value}
                      handleChange={onChange}
                      error={fieldState.error}
                      autoComplete="off"
                      {...fields.accessCode}
                    />
                  )}
                />
                <button
                  type="submit"
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
                    Enter
                  </Text>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mb-5">
          <BackLink />
        </div>
      </div>
    </section>
  );
};

export default Login;
