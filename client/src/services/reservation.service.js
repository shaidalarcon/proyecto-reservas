import API from "./api";

export const createReservation = async (reservationData) => {
  try {
    const res = await API.post("/reservations", reservationData);
    return res.data;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
};

export const getMyReservations = async () => {
  try {
    const res = await API.get("/reservations");
    return res.data;
  } catch (error) {
    console.error("Error al obtener mis reservas:", error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const res = await API.delete(`/reservations/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando reserva:", error);
    throw error;
  }
};
