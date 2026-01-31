const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courts",
      required: true,
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model(
  "reservations",
  reservationSchema,
  "reservations"
);

module.exports = Reservation;
