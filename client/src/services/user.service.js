import API from "./api";

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const changeUserRole = async (userId, newRole) => {
  const res = await API.patch(`/users/${userId}`, { role: newRole });
  return res.data;
};

export const registerUser = async (formData) => {
  const res = await API.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await API.post("/users/login", formData);
  return res.data;
};

export const updateUser = async (userId, formData) => {
  const res = await API.patch(`/users/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await API.delete(`/users/${userId}`);
  return res.data;
};
