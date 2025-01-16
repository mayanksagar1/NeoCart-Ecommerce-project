import { apiSlice } from "./apiSlice.js";
import { ORDER_URL, PAYPAL_URL } from "../constant.js";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDER_URL}/`,
        method: "POST",
        body: order
      })
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/`
      })
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/user`
      }),
      keepUnusedDataFor: 5,
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`
      })
    }),

    getTotalOrderCount: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-orders`
      })
    }),

    getTotalSales: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-sales`
      })
    }),

    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDER_URL}/total-sales-by-date`
      })
    }),

    getPaypalClientID: builder.query({
      query: () => ({
        url: `${PAYPAL_URL}`
      })
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDER_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    updateDeliveryStatus: builder.mutation({
      query: ({ id, orderStatus }) => ({
        url: `${ORDER_URL}/${id}/delivery-status`,
        method: "PUT",
        body: { orderStatus },
      })
    }),

    canReviewProduct: builder.query({
      query: ({ productId }) => ({
        url: `${ORDER_URL}/${productId}/review`,
        method: "GET"
      })
    })
  })
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetTotalOrderCountQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useGetPaypalClientIDQuery,
  usePayOrderMutation,
  useUpdateDeliveryStatusMutation,
  useCanReviewProductQuery,
} = orderApiSlice;