import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  removeCategoryById,
  updateCategoryById,
  createSubCategory,
  updateSubCategory,
  removeSubCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
  .post(authenticate, authorizeAdmin, createCategory)
  .get(getCategories);

router.route("/:id")
  .get(getCategoryById)
  .put(authenticate, authorizeAdmin, updateCategoryById)
  .delete(authenticate, authorizeAdmin, removeCategoryById);

router.route("/:id/subCategory").post(authenticate, authorizeAdmin, createSubCategory);

router.route("/:categoryId/:subCategoryId").put(authenticate, authorizeAdmin, updateSubCategory).delete(authenticate, authorizeAdmin, removeSubCategory);

export default router;