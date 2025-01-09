import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1, // Prevent negative or zero quantities
        },
        price: {
          type: Number,
          required: true, // Store the price at the time of adding to cart (for history tracking)
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Calculate the total price of the cart
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to calculate totalPrice before saving the cart
cartSchema.pre("save", function (next) {
  this.totalPrice = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
