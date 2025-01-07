import express from "express";
import { authenticate } from "../middleware/authHandler.js";
import { addAddress, getAddresses, updateAddress, deleteAddress } from "../controllers/addressController.js";

const router = express.Router();

router.route("/:userId")
  .post(authenticate, addAddress)
  .get(authenticate, getAddresses);

router.route("/:userId/:addressId")
  .put(authenticate, updateAddress)
  .delete(authenticate, deleteAddress);


export default router;