const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const upload = require("../../middlewares/file");
const {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const usersRouter = require("express").Router();

usersRouter.get("/", isAuth, isAdmin, getUsers);
usersRouter.post("/register", upload.single("image"), register);
usersRouter.post("/login", login);
usersRouter.patch("/:id", isAuth, upload.single("image"), updateUser);
usersRouter.delete("/:id", isAuth, deleteUser);

module.exports = usersRouter;
