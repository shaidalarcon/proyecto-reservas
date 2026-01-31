const Reservation = require("../models/reservation");

const postReservation = async (req, res, next) => {
  try {
    const { court, date, timeSlot, totalPrice } = req.body;
    const userId = req.user._id;

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const existingReservation = await Reservation.findOne({
      court: court,
      date: normalizedDate,
      timeSlot: timeSlot,
    });

    if (existingReservation) {
      return res
        .status(409)
        .json({ message: "Esa pista ya está reservada en ese horario" });
    }

    const newReservation = new Reservation({
      user: userId,
      court,
      date: normalizedDate,
      timeSlot,
      totalPrice,
    });

    const reservationSaved = await newReservation.save();

    return res.status(201).json(reservationSaved);
  } catch (error) {
    console.error("Error en postReservation:", error);
    return res.status(500).json({ message: "Error creando la reserva" });
  }
};

const getReservations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ user: userId })
      .populate("court")
      .sort({ date: 1 });

    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo reservas" });
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (reservation.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para cancelar esta reserva" });
    }

    await Reservation.findByIdAndDelete(id);

    return res.status(200).json({ message: "Reserva cancelada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la reserva" });
  }
};

module.exports = { postReservation, getReservations, deleteReservation };
