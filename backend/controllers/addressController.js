import Address from "../models/addressModel.js";
import User from "../models/userModels.js";
import asyncHandler from "../middleware/asyncHandler.js";

const addAddress = asyncHandler(async (req, res) => {
  try {
    const { fullName, phone, address, city, state, postalCode, country } = req.body;
    const userId = req.params.userId;

    if (!fullName || !phone || !address || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.state(404).json({ error: "User not found" });
    }

    const newAddress = new Address({ user: userId, ...req.body });
    await newAddress.save();
    res.json(newAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getAddresses = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    const addresses = await Address.find({ user: userId });
    res.json(addresses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateAddress = asyncHandler(async (req, res) => {
  try {
    const { fullName, phone, address, city, state, postalCode, country } = req.body;
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    if (!fullName || !phone || !address || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.state(404).json({ error: "User not found" });
    }
    const fullAddress = await Address.findByIdAndUpdate(addressId, { ...req.body }, { new: true });
    await fullAddress.save();
    res.json(fullAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const address = await Address.findByIdAndDelete(addressId);
    res.json(address);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};