import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    const itemsFromDb = await Product.find({ _id: { $in: orderItems.map((x) => x.product) } });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDb = itemsFromDb.find((itemFromDb) => itemFromDb._id.toString() === itemFromClient.product);

      if (!matchingItemFromDb) {
        return res.status(400).json({ error: `Product not found : ${itemFromClient.product} ` });
      }
      return {
        ...itemFromClient,
        product: itemFromClient.product,
        price: matchingItemFromDb.price,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 15;
    const skip = (page - 1) * 15;

    const orders = await Order.find({}).skip(skip).limit(limit).populate("user", "_id username");
    const totalCount = await Order.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      page,
      orders,
      totalCount,
      totalPages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const page = req.query.page || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId }).skip(skip).limit(limit);
    const totalCount = await Order.countDocuments({ user: userId });

    res.json({
      page,
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const countTotalOrders = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    res.json({ totalOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const calculateTotalSales = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, order) => order.totalPrice + acc, 0);
    res.json({ totalSales });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const calculateTotalSalesByDate = asyncHandler(async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.json(salesByDate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).json({ error: "Order Id is required" });
    }
    const order = await Order.findById(orderId).populate("user", "username email");
    if (!order) {
      res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }
    const orderStatus = req.body.orderStatus;
    if (orderStatus === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    order.orderStatus = orderStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const canReviewProductOrNot = asyncHandler(async (req, res) => {
  try {
    // Find a single order where the user purchased the product
    const order = await Order.findOne({
      user: req.user._id,
      "orderItems.product": req.params.productId, // Match specific product in orderItems
      isPaid: true
    });

    // If no such order exists, the user cannot review the product
    if (!order) {
      return res.json({ canReview: false });
    }

    // If a matching order is found, the user can review the product
    res.json({ canReview: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  getOrderById,
  markOrderAsPaid,
  updateDeliveryStatus,
  canReviewProductOrNot
};