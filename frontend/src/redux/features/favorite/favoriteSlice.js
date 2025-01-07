import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      // Check if the product is not already favorites
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavorites: (state, action) => {
      // remove the product with matching id.
      return state.filter((p) => p._id !== action.payload._id);
    },
    setFavorites: (state, action) => {
      // set the favorites from the local storage.
      return action.payload;
    }
  }
});

export const { addToFavorites, setFavorites, removeFromFavorites } = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;