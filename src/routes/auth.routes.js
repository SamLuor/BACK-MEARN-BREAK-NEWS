import { Router } from "express";
import { Login } from "../controllers/auth.controller.js";
const router = Router();

router.post("/", Login);

export default router;
