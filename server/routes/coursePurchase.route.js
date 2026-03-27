import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCheckoutSession, verifyPayment } from "../controllers/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout").post(isAuthenticated, createCheckoutSession);
router.route("/verify-payment").post(isAuthenticated, verifyPayment);

export default router;
