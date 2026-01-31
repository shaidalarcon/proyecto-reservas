const { isAuth } = require("../../middlewares/isAuth");
const {
  postReservation,
  getReservations,
  deleteReservation,
} = require("../controllers/reservation");

const reservationsRouter = require("express").Router();

reservationsRouter.post("/", isAuth, postReservation);
reservationsRouter.get("/", isAuth, getReservations);
reservationsRouter.delete("/:id", isAuth, deleteReservation);

module.exports = reservationsRouter;
