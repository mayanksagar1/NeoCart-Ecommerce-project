import express from "express";
import upload from "../config/multer.js";
import { uploadImages } from "../config/cloudinary.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";


const uploadToCloudinary = asyncHandler(async (req, res) => {

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const imageUrls = [];

    // looping over each file .
    for (const file of req.files) {
      // uploading each file to cloudinary
      const result = await uploadImages(file.buffer);

      // pushing the link received from cloudinary
      imageUrls.push(result);
    }
    res.json({ urls: imageUrls });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "No image file provided" });
  }
});

const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, upload.array("images"), uploadToCloudinary);

export default router;