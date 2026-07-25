import api from './api';

export const fetchFriends = async () => {
    const { data } = await api.get('/friends');
    return data;
}