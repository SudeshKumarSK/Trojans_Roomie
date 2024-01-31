import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favoriteListings: [], // Array of listing objects that are favorites
};

export const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            const listingToAdd = action.payload;
            if (!state.favoriteListings.some(listing => listing.listing_id === listingToAdd.listing_id)) {
                state.favoriteListings.push(listingToAdd);
            }
        },
        removeFavorite: (state, action) => {
            const listingIdToRemove = action.payload.listing_id;
            state.favoriteListings = state.favoriteListings.filter(
                listing => listing.listing_id !== listingIdToRemove
            );
        },
        toggleFavorite: (state, action) => {
            const listingToToggle = action.payload;
            const index = state.favoriteListings.findIndex(listing => listing.listing_id === listingToToggle.listing_id);
            if (index >= 0) {
                state.favoriteListings.splice(index, 1); // Remove if found
            } else {
                state.favoriteListings.push(listingToToggle); // Add if not found
            }
        },
    },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
