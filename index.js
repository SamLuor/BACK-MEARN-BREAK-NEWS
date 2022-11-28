import express from "express";
import connectDatabase from "./src/database/db.database.js";
import dotenv from "dotenv";

import userRoute from "./src/routes/user.routes.js";
import authRoute from "./src/routes/auth.routes.js";
import newsRoute from "./src/routes/news.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connectDatabase();
app.use(express.json());
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
