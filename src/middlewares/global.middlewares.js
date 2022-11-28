import mongoose from "mongoose";
import userService from "../services/user.services.js";

export const validId = (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid ID" });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const validUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await userService.findByidService(id);

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    req.id = id;
    req.user = user;

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
export const validFields = async (req, res, next) => {
  const { title, text, banner } = req.body;

  console.log(req.method);

  if (req.method === "PATCH") {
    if (!title && !text && !banner) {
      console.log("PATCH");
      return res.status(400).send({
        message: "Submit anything field",
      });
    }
  }

  if (req.method === "POST") {
    if (!title || !text || !banner) {
      return res.status(400).send({
        message: "Submit all fields",
      });
    }
  }

  next();
};
