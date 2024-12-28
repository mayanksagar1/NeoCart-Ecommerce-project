import { PRODUCTS_URL, UPLOADS_URL } from "../constant";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        params: { keyword, page }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCTS_URL}/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Products", id: productId }],
    }),

    getAllProducts: builder.query({
      query: () => `${PRODUCTS_URL}/all`,
      providesTags: ["Products"]
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"]
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"]
    }),

    addProductReview: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "POST",
        body: data,
      })
    }),

    updateProductReview: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: "PUT",
        body: data,
      })
    }),

    getTopProducts: builder.query({
      query: (page) => ({
        url: `${PRODUCTS_URL}/top`,
        method: "GET",
        params: page
      }),
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: (page) => ({
        url: `${PRODUCTS_URL}/new`,
        method: "GET",
        params: page
      }),
      keepUnusedDataFor: 5,
    }),

    uploadImages: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}/`,
        method: "POST",
        body: data
      }),

    })

  })
});

export const {
  useFetchProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductReviewMutation,
  useUpdateProductReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadImagesMutation
} = productsApiSlice;