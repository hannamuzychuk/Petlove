import { authGet, authPatch, authPost, authDelete } from './api';
import { setUser } from '../redux/authSlice';

export const getCurrentUserFull = async () => {
    const {data} = await authGet('/users/current/full/')
    return data;
};

export const editCurrentUser = async (payload) => {
    const {data} = await authPatch('/users/current/edit', payload);
    return data;
}

export const addPet = async (petData) => {
    const {data} = await authPost('/users/current/pets/add', petData);
    return data;
}

export const deletePet = async (id) => {
    const {data} = await authDelete(`/users/current/pets/remove/${id}`);
    return data;
}

export const fetchCurrentUserFull = async (dispatch) => {
    const data = await getCurrentUserFull();
    dispatch(setUser(data.user ?? data));
    return data;
}
