const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  qty:      { type: Number, required: true, min: 1 },
  img:      { type: String },
});

const orderSchema = new mongoose.Schema({
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String },
  },
  items:   [orderItemSchema],
  total:   { type: Number, required: true },
  type:    { type: String, enum: ["delivery", "pickup"], default: "delivery" },
  status:  { type: String, enum: ["pending","confirmed","preparing","ready","out_for_delivery","delivered","cancelled"], default: "pending" },
  payment: {
    method:            { type: String, enum: ["online", "cod"], default: "cod" },
    status:            { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },
  },
  estimatedTime: { type: Number, default: 40 },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);