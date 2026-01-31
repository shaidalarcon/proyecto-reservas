const User = require("../models/user");
const bcrypt = require("bcrypt");
const { deleteFile } = require("../../utils/deleteFile");
const { generateSign } = require("../../utils/jwt");

const SUPER_ADMIN_EMAIL = "admin@reservas.com";

const register = async (req, res, next) => {
  try {
    const user = new User({ ...req.body, role: "user" });
    const userDuplicated = await User.findOne({ email: user.email });

    if (userDuplicated) {
      return res.status(409).json({ message: "Este email ya está registrado" });
    }

    if (req.file) {
      user.image = req.file.path;
    }

    const userSaved = await user.save();

    return res.status(201).json(userSaved);
  } catch (error) {
    return res.status(400).json("Error en el registro");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("Usuario o contraseña incorrectos");
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = generateSign(user._id);

      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    return res.status(400).json("Error en el login");
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error mostrando usuarios");
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json("Usuario no encontrado");

    if (
      userToUpdate.email === SUPER_ADMIN_EMAIL &&
      req.body.role &&
      req.body.role !== "admin"
    ) {
      return res
        .status(403)
        .json("No puedes degradar al Administrador Principal.");
    }

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res
        .status(403)
        .json("No tienes permiso para modificar este usuario");
    }

    const patch = { ...req.body };

    if (req.file) {
      patch.image = req.file.path;
      if (userToUpdate.image) {
        deleteFile(userToUpdate.image);
      }
    }

    if (req.user.role !== "admin") {
      delete patch.role;
    }

    if (req.body.password) {
      patch.password = bcrypt.hashSync(req.body.password, 10);
    } else {
      delete patch.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, patch, {
      new: true,
    });

    updatedUser.password = undefined;

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).json("Error actualizando usuario");
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return res.status(404).json("Usuario no encontrado");
    }

    if (userToDelete.email === SUPER_ADMIN_EMAIL) {
      return res
        .status(403)
        .json("El Administrador Principal no puede ser eliminado.");
    }

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res
        .status(403)
        .json("No tienes permiso para eliminar este usuario");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser.image) {
      deleteFile(deletedUser.image);
    }

    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(400).json("Error eliminando usuario");
  }
};

module.exports = { register, login, getUsers, updateUser, deleteUser };
