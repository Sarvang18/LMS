import React, { useEffect } from 'react'
import { Button } from './ui/button'
import {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} from '@/features/api/purchaseApi';

const BuyCourseButton = ({ courseId }) => {
  const [createCheckoutSession, { data: checkoutData, isLoading: isCheckoutLoading, isSuccess: isCheckoutSuccess, isError: isCheckoutError, error: checkoutError }] = useCreateCheckoutSessionMutation();
  const [verifyPayment, { data: verifyData, isLoading: isVerifyLoading, isSuccess: isVerifySuccess, isError: isVerifyError, error: verifyError }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (isCheckoutSuccess && checkoutData) {
      if (checkoutData.order) {
        const loadRazorpay = () => {
          return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const initializeRazorpay = async () => {
          const res = await loadRazorpay();
          if (!res) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
          }

          const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
          if (!key) {
            alert("CRITICAL ERROR: VITE_RAZORPAY_KEY_ID is missing in Vercel. Please add it to your Environment Variables and redeploy.");
            return;
          }

          const options = {
            key: key,
            amount: checkoutData.order.amount,
            currency: "INR",
            name: "LMS Platform",
            description: `Purchase Course: ${checkoutData.course?.courseTitle || ""}`,
            order_id: checkoutData.order.id, 
            handler: async function (response) {
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
            },
            theme: { color: "#3399cc" }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };

        initializeRazorpay();
      }
    }
    
    if (isCheckoutError) {
      alert(checkoutError?.data?.message || "Failed to create checkout session");
    }
  }, [checkoutData, isCheckoutSuccess, isCheckoutError, checkoutError, verifyPayment]);

  useEffect(() => {
    if (isVerifySuccess) {
      alert("Payment Successful! Course Unlocked.");
      window.location.reload(); 
    }
    if (isVerifyError) {
      alert(verifyError?.data?.message || "Error verifying payment");
    }
  }, [isVerifySuccess, isVerifyError, verifyError]);

  const handlePurchase = () => {
    createCheckoutSession(courseId);
  }

  return (
    <Button 
      disabled={isCheckoutLoading || isVerifyLoading} 
      onClick={handlePurchase} 
      className={'w-full'}
    >
      {isCheckoutLoading ? "Processing..." : "Purchase course"}
    </Button>
  )
}

export default BuyCourseButton