import jwt from "jsonwebtoken";
import userServices from "../services/user.services.js";
import mongoose from "mongoose";

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401);
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2) {
      return res.status(401);
    }

    const [schema, token] = parts;

    if (schema !== "Bearer") {
      return res.send(401);
    }

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: "Token invalid" });
      }
      const user = await userServices.findByidService(decoded.id);

      if (!user || !user.id) {
        return res.status(401).send({ message: "Invalid token" });
      }

      req.userId = user._id;

      next();
    });
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
