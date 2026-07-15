import { createSlice } from '@reduxjs/toolkit';


const TOKEN_KEY = 'token';

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
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
     
        logOut: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem(TOKEN_KEY);
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;