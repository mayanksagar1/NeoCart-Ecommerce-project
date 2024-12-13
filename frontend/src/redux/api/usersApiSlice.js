import { apiSlice } from "./apiSlice.js";
import { USERS_URL } from "../constant.js";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      })
    }),
  })
});

export const { useLoginMutation } = usersApiSlice;