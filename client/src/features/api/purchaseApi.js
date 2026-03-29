import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = `${import.meta.env.VITE_API_BASE_URL}/purchase`;

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

    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery
} = purchaseApi;
