import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/user.service";
import { AuthContext } from "../hooks/useAuth";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  const login = async (formData) => {
    const response = await loginUser(formData);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("token", response.token);
    setUser(response.user);
  };

  const register = async (formData) => {
    await registerUser(formData);
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const value = {
    user,
    login,
    registerUser: register,
    logout,
    setUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
