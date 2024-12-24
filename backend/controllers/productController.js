import Product from "../models/productModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
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
    const product = new Product({ ...req.fields });
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

export { createProduct, updateProductById, deleteProductById, fetchProducts, fetchProductById, fetchAllProducts }; 