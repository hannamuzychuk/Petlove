import axios from 'axios';

const BASE_URL = 'https://petlove.b.goit.study/api';

const TOKEN_KEY = 'token';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if(!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const authGet = (url, config = {}) =>
  api.get(url, {
    ...config,
    headers: {
      ...config.headers,
      ...authHeaders(),
    },
  });

export const authPost = (url, data, config = {}) =>
  api.post(url, data, {
    ...config,
    headers: {
      ...config.headers,
      ...authHeaders(),
    },
  });

export const authDelete = (url, config = {}) =>
  api.delete(url, {
    ...config,
    headers: {
      ...config.headers,
      ...authHeaders(),
    },
  });

export default api;