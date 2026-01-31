const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    age: { type: Number },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dye0jsxng/image/upload/v1766753376/11539820_vfbwun.png",
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw new Error("Error al encriptar la contraseña: " + error.message);
  }
});

const User = mongoose.model("users", userSchema, "users");
module.exports = User;
