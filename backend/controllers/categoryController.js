import Category from "../models/categoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }
    const category = await new Category({ name }).save();
    return res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.id;
    const foundCategory = await Category.findOne({ _id: categoryId });
    res.json(foundCategory);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const updateCategoryById = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.id;
    const name = req.body.name;
    if (!name) {
      return res.json({ error: "Name is required" });
    }
    const foundCategory = await Category.findOne({ _id: categoryId });
    if (!foundCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    foundCategory.name = name;

    const updatedCategory = await foundCategory.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCategoryById = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.id);
    return res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  removeCategoryById
};