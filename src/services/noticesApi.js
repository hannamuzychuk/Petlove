import api, { authGet, authPost, authDelete } from './api';

export const getNotices = async ({
  keyword = '',
  category = '',
  sex = '',
  species = '',
  locationId = '',
  page = 1,
  limit = 6,
  byPopularity,
  byPrice,
} = {}) => {
  const { data } = await api.get('/notices', {
    params: {
      page,
      limit,
      ...(keyword ? { keyword } : {}),
      ...(category ? { category } : {}),
      ...(sex ? { sex } : {}),
      ...(species ? { species } : {}),
      ...(locationId ? { locationId } : {}),
      ...(byPopularity !== undefined ? { byPopularity } : {}),
      ...(byPrice !== undefined ? { byPrice } : {}),
    },
  });

  return data;
};

export const getNoticeById = async (id) => {
  const { data } = await authGet(`/notices/${id}`);
  return data;
};

export const addNoticeToFavorites = async (id) => {
  const { data } = await authPost(`/notices/favorites/add/${id}`);
  return data;
};

export const removeNoticeFromFavorites = async (id) => {
  const { data } = await authDelete(`/notices/favorites/remove/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get('/notices/categories');
  return data;
};

export const getSexOptions = async () => {
  const { data } = await api.get('/notices/sex');
  return data;
};

export const getSpeciesOptions = async () => {
  const { data } = await api.get('/notices/species');
  return data;
};

export const getCities = async (keyword = '') => {
  const { data } = await api.get('/cities', {
    params: keyword ? { keyword } : {},
  });
  return data;
};

export const getLocationOptions = async () => {
  const { data } = await api.get('/cities/locations');
  return data;
};
