import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  removeCategoryById,
  updateCategoryById
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(authenticate, authorizeAdmin);
router.route("/")
  .post(createCategory)
  .get(getCategories);

router.route("/:id")
  .get(getCategoryById)
  .put(updateCategoryById)
  .delete(removeCategoryById);

export default router;