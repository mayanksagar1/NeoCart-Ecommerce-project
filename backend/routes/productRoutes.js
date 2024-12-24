import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, formidable(), createProduct);

router.route("/all").get(fetchAllProducts);

router.route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, formidable(), updateProductById)
  .delete(authenticate, authorizeAdmin, deleteProductById);

export default router;