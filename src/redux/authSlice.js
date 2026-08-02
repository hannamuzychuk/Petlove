import { createSlice } from '@reduxjs/toolkit';


const TOKEN_KEY = 'token';

const savedToken  = localStorage.getItem(TOKEN_KEY);

const initialState = {
    token: savedToken || null,
    user: null,
    isAuthenticated: Boolean(savedToken),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;

            localStorage.setItem(TOKEN_KEY, action.payload.token);
        },

        setUser: (state, action) => {
            state.user = action.payload;
        },

        setNoticesFavorites: (state, action) => {
            if (!state.user) return;

            state.user.noticesFavorites = action.payload;
        },
     
        logOut: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem(TOKEN_KEY);
        },
    },
});

export const { setCredentials, logOut, setUser, setNoticesFavorites } = authSlice.actions;
export default authSlice.reducer;