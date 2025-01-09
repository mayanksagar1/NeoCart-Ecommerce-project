import asyncHandler from "../middleware/asyncHandler.js";
import Cart from "../models/cartModel.js";

const getCart = asyncHandler(async (req, res) => {
  try {
    // Use findOne to query by the `user` field
    let cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");

    // If no cart exists, create a new cart for the user
    if (!cart) {
      cart = new Cart({ user: req.user._id });
      await cart.save(); // Save the new cart
    }

    res.json(cart); // Send the cart as JSON response
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    // If no cart exists, create a new cart for the user
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [{ product: productId, quantity, price }] });
    } else {
      const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity += quantity; // Increment quantity
      } else {
        cart.cartItems.push({ product: productId, quantity, price });
      }
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateCartItem = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.itemId;
    const quantity = req.body.quantity;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" });
    }

    const item = cart.cartItems.find((item) => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found!" });
    }

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCartItem = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" });
    }

    cart.cartItems = cart.cartItems.filter((item) => item._id.toString() !== itemId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const clearCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.cartItems = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
