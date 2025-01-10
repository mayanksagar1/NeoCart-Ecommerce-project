import { apiSlice } from "./apiSlice.js";
import { CART_URL } from "../constant.js";

const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: `${CART_URL}/`,
      }),
      providesTags: ["Cart"]
    }),

    addToCart: builder.mutation({
      query: ({ productId, quantity, price }) => ({
        url: `${CART_URL}/`,
        method: "POST",
        body: { productId, quantity, price },
      }),
      invalidatesTags: ["Cart"]
    }),

    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `${CART_URL}/${itemId}`,
        method: "PUT",
        body: { quantity }
      }),
      invalidatesTags: ["Cart"]
    }),

    removeCartItem: builder.mutation({
      query: (itemId) => ({
        url: `${CART_URL}/${itemId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Cart"]
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: `${CART_URL}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Cart"]
    })

  })
});

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveCartItemMutation, useClearCartMutation } = cartApiSlice;