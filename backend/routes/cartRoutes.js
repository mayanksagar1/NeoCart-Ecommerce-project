import express from "express";
import { authenticate } from "../middleware/authHandler.js";
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.route("/")
  .get(authenticate, getCart)
  .post(authenticate, addToCart)
  .delete(authenticate, clearCart);

router.route("/:itemId")
  .put(authenticate, updateCartItem)
  .delete(authenticate, removeCartItem);

export default router;