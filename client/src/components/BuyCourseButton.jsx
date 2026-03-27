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
        // Initialize Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: checkoutData.order.amount,
          currency: "INR",
          name: "LMS Platform",
          description: `Purchase Course: ${checkoutData.course?.courseTitle || ""}`,
          order_id: checkoutData.order.id, 
          handler: async function (response) {
            // Call the verify mutation
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
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