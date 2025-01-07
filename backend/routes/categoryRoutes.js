import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  removeCategoryById,
  updateCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
  .post(authenticate, authorizeAdmin, createCategory)
  .get(getCategories);

router.route("/:id")
  .get(getCategoryById)
  .put(authenticate, authorizeAdmin, updateCategoryById)
  .delete(authenticate, authorizeAdmin, removeCategoryById);


export default router;