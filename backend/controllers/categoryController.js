import Category from "../models/categoryModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { RestartProcess } from "concurrently";

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

const createSubCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Please provide a name" });
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const alreadyExists = category.subCategories.find((c) => c.name === name);
    if (alreadyExists) return res.status(400).json({ error: "Category already exists" });
    category.subCategories.push({ name });
    await category.save();
    res.json({ message: "Category created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateSubCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Please provide a name" });
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const subCategory = category.subCategories.find((c) => c._id.toString() === req.params.subCategoryId.toString());
    if (!subCategory) res.status(404).json({ error: "Sub category not found" });
    subCategory.name = name;
    category.save();
    res.json({ message: "Sub category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeSubCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const subCategory = category.subCategories.filter((c) => c.id.toString() !== req.params.subCategoryId.toString());
    category.subCategories = subCategory;
    await category.save();
    res.json({ message: "Category removed successFully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  removeCategoryById,
  createSubCategory,
  updateSubCategory,
  removeSubCategory
};