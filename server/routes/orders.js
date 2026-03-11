const express = require("express");
const Order   = require("../models/Order");
const { protect } = require("../middleware/auth");
const { sendEmail } = require("../config/email");

const router = express.Router();

// Public — place order
router.post("/", async (req, res, next) => {
  try {
    const { customer, items, total, type, paymentMethod } = req.body;
    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const order = await Order.create({
      customer, items, total, type,
      status: "confirmed",
      payment: {
        method: paymentMethod || "cod",
        status: paymentMethod === "cod" ? "pending" : "paid",
        razorpayOrderId:   `DUMMY_${Date.now()}`,
        razorpayPaymentId: `PAY_${Math.random().toString(36).slice(2,10).toUpperCase()}`,
      },
    });
    sendEmail(customer.email, "orderConfirm", {
      orderId: order._id.toString().slice(-6).toUpperCase(),
      items,
      total,
    });
    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// Admin — get all orders
router.get("/", protect, async (req, res, next) => {
  try {
    const orders = await Order.find().sort("-createdAt");
    res.json({ success: true, orders });
  } catch (err) { next(err); }
});

// Admin — update order status
router.patch("/:id/status", protect, async (req, res, next) => {
  try {
    const valid = ["pending","confirmed","preparing","ready","out_for_delivery","delivered","cancelled"];
    const { status } = req.body;
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    const io = req.app.get("io");
    if (io) io.emit("orderStatusUpdate", { orderId: order._id, status });
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

module.exports = router;