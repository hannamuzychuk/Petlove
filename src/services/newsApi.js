import api from './api';

export const getNews = async ({ keyword = '', page = 1, limit = 6 } = {}) => {
    const {data} = await api.get('/news', {
        params: {
            page,
            limit,
            ...(keyword ? {keyword} : {}),
        },
    });
    return data;
}; 