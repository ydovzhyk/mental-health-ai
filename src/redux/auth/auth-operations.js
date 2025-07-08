import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  axiosRegister,
  axiosLogin,
  axiosLogout,
  axiosGetCurrentUser,
  axiosRegisterIncognito,
  axiosCheckAccessCode,
  axiosLoginIncognito,
} from '../../api/auth';
import { setModalWindowStatus } from '../technical/technical-slice';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosRegister(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('mental-health.authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const registerIncognito = createAsyncThunk(
  'auth/register-incognito',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosRegisterIncognito(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('mental-health.authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const checkAccessCode = createAsyncThunk(
  'auth/check-access-code',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosCheckAccessCode(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogin(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('mental-health.authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const loginIncognito = createAsyncThunk(
  'auth/login-incognito',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLoginIncognito(userData);
      const { accessToken, refreshToken, sid } = data;
      const authData = { accessToken, refreshToken, sid };
      localStorage.setItem('mental-health.authData', JSON.stringify(authData));
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosLogout();
      localStorage.removeItem('mental-health.authData');
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/current',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authDataJSON = localStorage.getItem('mental-health.authData');
      const authData = JSON.parse(authDataJSON);
      const userData = authData;
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/current',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const data = await axiosGetCurrentUser(userData);
      return data;
    } catch (error) {
      const { data, status } = error.response;
      dispatch(setModalWindowStatus(true));
      return rejectWithValue({ data, status });
    }
  }
);
