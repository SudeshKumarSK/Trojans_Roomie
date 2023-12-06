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
            state.spotifyData = action.payload; // Assume payload contains Spotify data
            state.spotifyError = null;
        },

        spotifyFailure: (state, action) => {
            state.spotifyLoading = false;
            state.spotifyError = action.payload.message || 'Something went wrong!';
        },

        // If you need to clear Spotify data upon user sign out
        clearSpotifyData: (state) => {
            state.spotifyData = null;
            state.spotifyError = null;
            // Don't forget to reset loading if needed
            state.spotifyLoading = false;
        },
    },
});

// Export actions
export const {
    spotifyStart,
    spotifySuccess,
    spotifyFailure,
    clearSpotifyData,
} = spotifySlice.actions;

// Export reducer
export default spotifySlice.reducer;
