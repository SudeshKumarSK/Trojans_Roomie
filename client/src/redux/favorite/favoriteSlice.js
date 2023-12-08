import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favoriteListings: [], // An array to store favorite listings
};

const favoriteSlice = createSlice({
    name: "favourites",
    initialState,
    reducers: {
        // Action to add a listing to favorites
        addFavorite: (state, action) => {
            // Check if the listing is not already in favorites
            if (!state.favoriteListings.some((listing) => listing.id === action.payload.id)) {
                state.favoriteListings.push(action.payload);
            }
        },

        // Action to remove a listing from favorites
        removeFavorite: (state, action) => {
            state.favoriteListings = state.favoriteListings.filter(
                (listing) => listing.id !== action.payload.id
            );
        },
    },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
