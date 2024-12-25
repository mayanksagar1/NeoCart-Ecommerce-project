import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { error } from "console";

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, brand, price, description, quantity, category } = req.body;
    // validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    // for storing the cloudinary urls
    const imageUrls = [];

    // looping over each file .
    for (const file of req.files) {
      // uploading each file to cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      // pushing the link received from cloudinary
      imageUrls.push(result.secure_url);

      // delete the file from the local server
      fs.unlinkSync(file.path);
    }

    const product = new Product({ ...req.fields, images: imageUrls });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductById = asyncHandler(async (req, res) => {
  try {
    const { name, brand, price, description, quantity, category } = req.fields;
    // validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.fields }, { new: true });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const deleteProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 6;


    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const totalCount = await Product.countDocuments();

    res.json({
      products,
      page: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ error: "Product id not given" });
    }
    const product = await Product.findById(id);
    if (!product) { }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const skip = (page - 1) * 12;
    const products = await Product.find({}).populate("category").sort({ createdAt: -1 }).skip(skip).limit(12);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment, } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review successfully added" });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const updateProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }
    const review = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (!review) {
      res.status(404).json({ error: "Review not found" });
    }
    review.rating = Number(rating);
    review.comment = comment;

    product.numReviews = product.reviews.length;
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});


const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page;
    const products = await Product.find({}).sort({ ratings: -1 }).skip((page - 1) * 4).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page;
    const products = await Product.find({}).sort({ _id: -1 }).skip((page - 1) * 4).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});


export {
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  updateProductReview,
  fetchTopProducts,
  fetchNewProducts,
}; 