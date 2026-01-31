import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reserve from "./pages/Reserve";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import EditCourt from "./pages/EditCourt";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import CreateCourt from "./pages/CreateCourt";

const App = () => {
  return (
    <AuthContextProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reserve/:id" element={<Reserve />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/create" element={<CreateCourt />} />
          <Route path="/admin/edit/:id" element={<EditCourt />} />
        </Routes>
      </Layout>
    </AuthContextProvider>
  );
};

export default App;
