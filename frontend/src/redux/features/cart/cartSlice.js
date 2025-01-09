import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cart")) || {
  cartItems: [],
  totalPrice: 0
};

const calculateTotalPrice = (cartItems) =>
  cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload.cartItems;
      state.totalPrice = action.payload.totalPrice;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    addToCart: (state, action) => {
      const existingItem = state.cartItems.find((item) => item.product === action.payload.product);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      state.totalPrice = calculateTotalPrice(state.cartItems);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateCartItem: (state, action) => {
      const { product, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.product === product);
      if (item) {
        item.quantity = quantity;
      }
      state.totalPrice = calculateTotalPrice(state.cartItems);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
      state.totalPrice = calculateTotalPrice(state.cartItems);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  }
});

export const {
  setCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
