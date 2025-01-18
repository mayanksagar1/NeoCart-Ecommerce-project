import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  loginUser,
  logoutCurrentUser,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  getUserCount
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";


const router = express.Router();

router.route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.route("/login")
  .post(loginUser);

router.route("/logout")
  .post(logoutCurrentUser);

router.route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

router.route("/total-users").get(authenticate, authorizeAdmin, getUserCount);
// admin routes
router.route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);
export default router;