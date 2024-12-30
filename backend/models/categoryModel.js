import mongoose from 'mongoose';

const subCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 32,
    unique: true,
  }
});

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 32,
    unique: true,
  },
  subCategories: [subCategorySchema]
});

const Category = mongoose.model("Category", categorySchema);

export default Category;