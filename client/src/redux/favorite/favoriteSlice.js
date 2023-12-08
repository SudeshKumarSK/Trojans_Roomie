import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favoriteListings: [], // An array to store favorite listings
};

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        // Action to add a listing to favorites
        addFavorite: (state, action) => {
            const listingToAdd = action.payload;
            // Check if the listing is not already in favorites
            if (!state.favoriteListings.some(listing => listing.listing_id === listingToAdd.listing_id)) {
                state.favoriteListings.push(listingToAdd);
            }
        },

        // Action to remove a listing from favorites
        removeFavorite: (state, action) => {
            const listingIdToRemove = action.payload.listing_id;
            state.favoriteListings = state.favoriteListings.filter(
                listing => listing.listing_id !== listingIdToRemove
            );
        },
    },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
