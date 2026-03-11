const express     = require("express");
const Reservation = require("../models/Reservation");
const { protect } = require("../middleware/auth");
const { sendEmail } = require("../config/email");

const router = express.Router();

// Public — create reservation
router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, note } = req.body;
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }
    const reservation = await Reservation.create({ name, email, phone, date, time, guests, note });
    sendEmail(email, "reservationConfirm", { name, date, time, guests, note });
    if (process.env.EMAIL_USER) {
      sendEmail(process.env.EMAIL_USER, "adminNewReservation", { name, email, phone, date, time, guests, note });
    }
    res.status(201).json({ success: true, reservation });
  } catch (err) { next(err); }
});

// Admin — get all reservations
router.get("/", protect, async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort("-createdAt");
    res.json({ success: true, reservations });
  } catch (err) { next(err); }
});

// Admin — approve or decline
router.patch("/:id/status", protect, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, reservation });
  } catch (err) { next(err); }
});

// Admin — delete
router.delete("/:id", protect, async (req, res, next) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Reservation deleted" });
  } catch (err) { next(err); }
});

module.exports = router;