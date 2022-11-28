import jwt from "jsonwebtoken";
import userServices from "../services/user.services.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || authorization == undefined) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const [schema, token] = parts;

    if (schema !== "Bearer") {
      return res.send(401).send({ message: "Unauthorized" });
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
