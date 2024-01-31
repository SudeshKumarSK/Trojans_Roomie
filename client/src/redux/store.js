import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import spotifyReducer from "./spotify/spotifySlice";
import favoriteReducer from "./favorite/favoriteSlice"; // Import the favourites reducer
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

// Include the favourites reducer in the combined reducers
const rootReducer = combineReducers({
    user: userReducer,
    spotify: spotifyReducer,
    favorite: favoriteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
