import { CATEGORY_URL } from "../constant";
import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}/`,
        method: "GET"
      })
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}/`,
        method: "POST",
        body: data,
      })
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "PUT",
        body: data,
      })
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      })
    }),

    getCategoryById: builder.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "GET",
      })
    }),
  }),
});

export const {
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdMutation } = categoryApiSlice;