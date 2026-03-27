import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import User from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Check if user already purchased the course
    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });

    if (existingPurchase) {
      return res.status(400).json({ message: "You already own this course" });
    }

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: "pending",
    });

    const options = {
      amount: course.coursePrice * 100, // exact amount in paise 
      currency: "INR",
      receipt: `receipt_${newPurchase._id}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // Save purchase record with Razorpay Order ID as temporary paymentId
    newPurchase.paymentId = order.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      order,
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Find the purchase record
    const purchase = await CoursePurchase.findOne({ paymentId: razorpay_order_id }).populate("courseId");
    if (!purchase) {
      return res.status(404).json({ message: "Purchase record not found" });
    }

    // Update status
    purchase.status = "completed";
    purchase.paymentId = razorpay_payment_id; // real payment id
    await purchase.save();

    // Unlock course for user
    const course = await Course.findById(purchase.courseId);
    if (course && !course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    const user = await User.findById(userId);
    if (user && !user.enrolledCourses.includes(course._id)) {
      user.enrolledCourses.push(course._id);
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Payment verified successfully", courseId: course._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased, // true if purchased, false otherwise
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};