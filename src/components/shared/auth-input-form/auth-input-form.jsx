'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login, register } from '@/redux/auth/auth-operations';
import { setCopiedAccessCode } from '@/redux/technical/technical-slice';
import loadAvatar from '@/utils/load-avatar';
import Button from '../button/button';
import HumanVerification from '../humanVerification/humanVerification';
import { fields } from '../text-field/fields';
import TextField from '../text-field/text-field';
import Text from '../text/text';
import { useTranslate } from '@/utils/translating/translating';
import avatarMale from '@/images/male.png';
import avatarFemale from '@/images/female.png';

const AuthInputForm = ({ typeOperation, isDoctor = false }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const btnText = useTranslate(
    pathname === '/login' ? 'Login' : 'registration'
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      sex: 'male',
    },
  });

  const onSubmit = async data => {
    if (typeOperation === 'registration') {
      const base64Avatar =
        data.sex === 'male'
          ? await loadAvatar(avatarMale.src)
          : await loadAvatar(avatarFemale.src);

      const userData = {
        ...data,
        userAvatar: base64Avatar,
        role: isDoctor ? 'doctor' : 'patient',
      };
      dispatch(register(userData));
      dispatch(setCopiedAccessCode(true));
    } else {
      const userData = { email: data.email, password: data.password };
      dispatch(login(userData));
    }
    reset({ username: '', email: '', password: '', sex: 'male' });
  };

  const handleVerification = isVerified => {
    setIsHumanVerified(isVerified);
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      {typeOperation === 'registration' && (
        <Controller
          control={control}
          name="username"
          rules={{
            required: useTranslate('User name is required'),
            minLength: {
              value: 2,
              message: useTranslate('Name must have at least 2 characters'),
            },
            maxLength: {
              value: 15,
              message: useTranslate(
                'Name must have no more than 15 characters'
              ),
            },
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <TextField
              value={value}
              handleChange={onChange}
              error={fieldState.error}
              autoComplete="off"
              {...fields.username}
            />
          )}
        />
      )}
      <Controller
        control={control}
        name="email"
        rules={{
          required: useTranslate('Email is required'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: useTranslate('Invalid email address'),
          },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <TextField
            value={value}
            handleChange={onChange}
            error={fieldState.error}
            {...fields.email}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: useTranslate('Password is required'),
          minLength: {
            value: 8,
            message: useTranslate('Password must have at least 8 characters'),
          },
          maxLength: {
            value: 20,
            message: useTranslate(
              'Password must have no more than 20 characters'
            ),
          },
        }}
        render={({ field: { onChange, value }, fieldState }) => (
          <TextField
            value={value}
            handleChange={onChange}
            error={fieldState.error}
            autoComplete="current-password"
            {...fields.password}
          />
        )}
      />

      {typeOperation === 'registration' && (
        <Controller
          control={control}
          name="sex"
          render={({ field: { onChange, value } }) => (
            <div className="flex gap-4 items-center text-sm text-black my-[-15px]">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="male"
                  checked={value === 'male'}
                  onChange={onChange}
                  className="accent-black"
                />
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-black"
                >
                  Male
                </Text>
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="female"
                  checked={value === 'female'}
                  onChange={onChange}
                  className="accent-black"
                />
                <Text
                  type="tiny"
                  as="p"
                  fontWeight="normal"
                  className="text-black"
                >
                  Female
                </Text>
              </label>
            </div>
          )}
        />
      )}

      {typeOperation === 'registration' && (
        <div className="w-full flex flex-col items-center mb-[-15px]">
          <HumanVerification onVerify={handleVerification} />
        </div>
      )}
      <div className="w-full flex flex-row items-center justify-center mb-[-15px]">
        <Button
          text={btnText}
          btnClass={
            typeOperation === 'registration'
              ? isHumanVerified
                ? 'btnLight'
                : 'btnDisabled'
              : 'btnLight'
          }
          disabled={typeOperation === 'registration' ? !isHumanVerified : false}
        />
      </div>
    </form>
  );
};

export default AuthInputForm;
