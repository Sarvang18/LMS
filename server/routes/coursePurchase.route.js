import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, getAllPurchasedCourse, getCourseDetailWithPurchaseStatus, verifyPayment } from "../controllers/coursePurchase.controller.js";

const router = express.Router();


router.route("/checkout").post(isAuthenticated, createCheckoutSession);// razorpay vale
router.route("/verify-payment").post(isAuthenticated, verifyPayment);// razorpay vale


router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(isAuthenticated,getAllPurchasedCourse);

export default router;
