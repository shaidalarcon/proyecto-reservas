const Court = require("../models/court");
const { deleteFile } = require("../../utils/deleteFile");
const Reservation = require("../models/reservation");

const getCourts = async (req, res, next) => {
  try {
    const courts = await Court.find();

    return res.status(200).json(courts);
  } catch (error) {
    return res.status(400).json("Error mostrando pistas");
  }
};

const getCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const court = await Court.findById(id);

    if (!court) {
      return res.status(404).json("Pista no encontrada");
    }

    return res.status(200).json(court);
  } catch (error) {
    return res.status(400).json("Error buscando pista");
  }
};

const DEFAULT_COURT_IMAGE =
  "https://images.unsplash.com/photo-1593012370132-c4390ff79e92?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const postCourt = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const existingCourt = await Court.findOne({ name });

    if (existingCourt) {
      if (req.file) deleteFile(req.file.path);
      return res.status(409).json("Ya existe una pista con este nombre");
    }

    const newCourt = new Court(req.body);

    if (req.file) {
      newCourt.image = req.file.path;
    } else {
      newCourt.image = DEFAULT_COURT_IMAGE;
    }

    if (!description || description.trim() === "") {
      newCourt.description = "Nueva pista disponible para reservar";
    }

    const savedCourt = await newCourt.save();

    return res.status(201).json(savedCourt);
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    return next(error);
  }
};

const updateCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = { ...req.body };

    if (req.body.name) {
      const courtWithSameName = await Court.findOne({ name: req.body.name });

      if (courtWithSameName && courtWithSameName._id.toString() !== id) {
        if (req.file) deleteFile(req.file.path);
        return res.status(409).json("Ya existe otra pista con este nombre");
      }
    }

    delete patch.image;
    if (req.file) {
      patch.image = req.file.path;
      const oldCourt = await Court.findById(id);

      if (
        oldCourt &&
        oldCourt.image &&
        oldCourt.image !== DEFAULT_COURT_IMAGE
      ) {
        deleteFile(oldCourt.image);
      }
    }

    const updatedCourt = await Court.findByIdAndUpdate(id, patch, {
      new: true,
    });

    return res.status(200).json(updatedCourt);
  } catch (error) {
    if (req.file) deleteFile(req.file.path);
    return next(error);
  }
};

const deleteCourt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCourt = await Court.findByIdAndDelete(id);

    if (!deletedCourt) return res.status(404).json("Pista no encontrada");

    if (deletedCourt.image) {
      deleteFile(deletedCourt.image);
    }

    await Reservation.deleteMany({ court: id });

    return res
      .status(200)
      .json({ message: "Pista y sus reservas eliminadas correctamente" });
  } catch (error) {
    return res.status(400).json("Error eliminando pista");
  }
};

module.exports = { getCourts, postCourt, updateCourt, deleteCourt, getCourt };
