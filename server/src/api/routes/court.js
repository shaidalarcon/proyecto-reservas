const { isAdmin } = require("../../middlewares/isAdmin");
const { isAuth } = require("../../middlewares/isAuth");
const upload = require("../../middlewares/file");
const {
  getCourts,
  postCourt,
  updateCourt,
  deleteCourt,
  getCourt,
} = require("../controllers/court");

const courtsRouter = require("express").Router();

courtsRouter.get("/", getCourts);
courtsRouter.get("/:id", getCourt);
courtsRouter.post("/", isAuth, isAdmin, upload.single("image"), postCourt);
courtsRouter.put("/:id", isAuth, isAdmin, upload.single("image"), updateCourt);
courtsRouter.delete("/:id", isAuth, isAdmin, deleteCourt);

module.exports = courtsRouter;
