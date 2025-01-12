import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice.js";
import favoritesReducer from "./features/favorite/favoriteSlice.js";
import cartReducer from "./features/cart/cartSlice.js";
import shopReducer from "./features/shop/shopSlice.js";
import { getFavoritesFromLocalStorage } from "../utils/favorites.js";

const initialFavoriteState = getFavoritesFromLocalStorage() || [];

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    shop: shopReducer,
  },

  preloadedState: {
    favorites: initialFavoriteState,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;