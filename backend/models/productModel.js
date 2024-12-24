import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
},
  { timestamps: true });

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  ratings: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
},
  { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;