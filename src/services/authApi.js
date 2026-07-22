import api from './api';
import { startLoading, stopLoading } from '../redux/loadingSlice';
import { setCredentials } from '../redux/authSlice';

export const registerUser = (formData) => async (dispatch) => {
    dispatch(startLoading());
    try {
        const {name, email, password} = formData;
        const {data} = await api.post('users/signup', {name, email, password});

        dispatch(
            setCredentials({
                token: data.token,
                user: data.user ?? {name: data.name, email: data.email},
            })
        );
        return data;
    } finally {
        dispatch(stopLoading());
    }
};;

const loginUser = (formData) => async (dispatch) => {
    dispatch(startLoading());
    try {
        const {email, password} = formData;
        const {data} = await api.post('users/signin', {email, password});

        dispatch(
            setCredentials({
                token: data.token,
                user: data.user ?? {name: data.name, email: data.email},
            })
        )
        return data;
    } finally {
        dispatch(stopLoading());
    }
};
