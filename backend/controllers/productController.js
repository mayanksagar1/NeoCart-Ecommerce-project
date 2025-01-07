import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


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
    const product = new Product({ ...req.body });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductById = asyncHandler(async (req, res) => {
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
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
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
    const keyword = req.query.keyword;
    const page = req.query.page || 1;
    const limit = 8;
    const filter = keyword ? {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
      ],
    } : {};

    const skip = (page - 1) * limit;

    const products = await Product.find(filter).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(filter);

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
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).populate("category").sort({ createdAt: -1 });
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
    const products = await Product.find({}).sort({ ratings: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
});

const fetchProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const page = req.query.page || 1;
    const limit = 8;
    const filter = categoryId ? {
      category: categoryId,
    } : {};

    const skip = (page - 1) * limit;

    const products = await Product.find(filter).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(filter);

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
  fetchProductsByCategory,
}; 