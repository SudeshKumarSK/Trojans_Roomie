import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.message || 'Something went wrong!';

        },

        // New signUp actions
        signUpStart: (state) => {
            state.loading = true;
        },
        signUpSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.message || 'Something went wrong!';
        },

        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.message || 'Something went wrong!';
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload.message || 'Something went wrong!';
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },

    },
});
export const { signInStart,
    signInSuccess,
    signInFailure,
    signUpStart,
    signUpSuccess,
    signUpFailure,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOut } = userSlice.actions;

export default userSlice.reducer;