const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, required: true },
    price: { type: Number, required: true },
    surface: { type: String },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Court = mongoose.model("courts", courtSchema, "courts");
module.exports = Court;
