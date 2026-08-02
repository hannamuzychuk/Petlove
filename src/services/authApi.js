import api, { authGet } from './api';
import { startLoading, stopLoading } from '../redux/loadingSlice';
import { setCredentials, setUser, logOut } from '../redux/authSlice';

const mapAuthUser = (data) =>
  data.user ?? {
    name: data.name,
    email: data.email,
    noticesFavorites: data.noticesFavorites ?? [],
  };

export const refreshUser = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) return;

  try {
    const { data } = await authGet('/users/current');
    dispatch(setUser(data.user ?? data));
  } catch {
    dispatch(logOut());
  }
};

export const registerUser = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const { name, email, password } = formData;
    const { data } = await api.post('/users/signup', { name, email, password });

    dispatch(
      setCredentials({
        token: data.token,
        user: mapAuthUser(data),
      }),
    );
    await dispatch(refreshUser());
    return data;
  } finally {
    dispatch(stopLoading());
  }
};

export const loginUser = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const { email, password } = formData;
    const { data } = await api.post('/users/signin', { email, password });

    dispatch(
      setCredentials({
        token: data.token,
        user: mapAuthUser(data),
      }),
    );
    await dispatch(refreshUser());
    return data;
  } finally {
    dispatch(stopLoading());
  }
};
