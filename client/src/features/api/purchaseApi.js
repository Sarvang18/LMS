import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout",
        method: "POST",
        body: { courseId },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (paymentDetails) => ({
        url: "/verify-payment",
        method: "POST",
        body: paymentDetails,
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} = purchaseApi;
