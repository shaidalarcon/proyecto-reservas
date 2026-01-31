import API from "./api";

export const getAllCourts = async () => {
  try {
    const res = await API.get("/courts");
    return res.data;
  } catch (error) {
    console.error("Error al recuperar las pistas:", error);
    throw error;
  }
};

export const getCourtById = async (id) => {
  try {
    const res = await API.get(`/courts/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al recuperar la pista:", error);
    throw error;
  }
};

export const createCourt = async (formData) => {
  try {
    const res = await API.post("/courts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al crear la pista:", error);
    throw error;
  }
};

export const updateCourt = async (id, formData) => {
  try {
    const res = await API.put(`/courts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error al actualizar la pista:", error);
    throw error;
  }
};

export const deleteCourt = async (id) => {
  try {
    const res = await API.delete(`/courts/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al borrar la pista:", error);
    throw error;
  }
};
