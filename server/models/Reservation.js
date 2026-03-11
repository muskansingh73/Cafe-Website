const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  name:   { type: String, required: true, trim: true },
  email:  { type: String, required: true, lowercase: true, trim: true },
  phone:  { type: String, required: true },
  date:   { type: String, required: true },
  time:   { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  note:   { type: String, default: "" },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);