require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");

const usersRouter = require("./src/api/routes/user");
const courtsRouter = require("./src/api/routes/court");
const reservationsRouter = require("./src/api/routes/reservation");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();
connectCloudinary();

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/courts", courtsRouter);
app.use("/api/v1/reservations", reservationsRouter);

app.use((req, res, next) => {
  return res.status(404).json("Route Not Found");
});

app.listen(3000, () => {
  console.log("Servidor levantado en: http://localhost:3000");
});