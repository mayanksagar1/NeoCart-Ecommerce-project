import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  updateDeliveryStatus,
  canReviewProductOrNot,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/user").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);
router.route("/:id").get(authenticate, getOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/delivery-status").put(authenticate, authorizeAdmin, updateDeliveryStatus);
router.route("/:productId/review").get(authenticate, canReviewProductOrNot);


export default router;