import { apiSlice } from "./apiSlice";
import { ADDRESS_URL } from "../constant";

const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAddresses: builder.query({
      query: (userId) => ({
        url: `${ADDRESS_URL}/${userId}`,
        method: "GET"
      }),
    }),
    createAddress: builder.mutation({
      query: ({ userId, data }) => ({
        url: `${ADDRESS_URL}/${userId}`,
        method: "POST",
        body: data
      }),
    }),
    updateAddress: builder.mutation({
      query: ({ userId, addressId, data }) => ({
        url: `${ADDRESS_URL}/${userId}/${addressId}`,
        method: "PUT",
        body: data,
      })
    }),
    deleteAddress: builder.mutation({
      query: ({ userId, addressId }) => ({
        url: `${ADDRESS_URL}/${userId}/${addressId}`,
        method: "DELETE",
      })
    })
  })
});

export const { useCreateAddressMutation, useFetchAddressesQuery, useDeleteAddressMutation, useUpdateAddressMutation } = addressApiSlice;