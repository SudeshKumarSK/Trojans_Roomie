import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    spotifyLoading: false,
    spotifyError: null,
    spotifyData: null,
};

export const spotifySlice = createSlice({
    name: 'spotify',
    initialState,
    reducers: {
        spotifyStart: (state) => {
            state.spotifyLoading = true;
            state.spotifyError = null;
        },

        spotifySuccess: (state, action) => {
            state.spotifyLoading = false;
            state.spotifyData = action.payload; 
            state.spotifyError = null;
        },

        spotifyFailure: (state, action) => {
            state.spotifyLoading = false;
            state.spotifyError = action.payload.message || 'Something went wrong!';
        },

        // If you need to clear Spotify data upon user sign out
        spotifyDisconnect: (state) => {
            state.spotifyData = null;
            state.spotifyError = null;
            state.spotifyLoading = false;
        },
    },
});

// Export actions
export const {
    spotifyStart,
    spotifySuccess,
    spotifyFailure,
    spotifyDisconnect,
} = spotifySlice.actions;

// Export reducer
export default spotifySlice.reducer;
