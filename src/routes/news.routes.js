import { Router } from "express";
const router = Router();

import {
  create,
  findAll,
  topNews,
  findById,
} from "../controllers/news.controller.js";

router.post("/", create);
router.get("/", findAll);
router.get("/top", topNews);
router.get("/:id", findById);

export default router;
