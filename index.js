import express from "express";
import connectDatabase from "./src/database/db.database.js";
import userRoute from "./src/routes/user.routes.js";

const port = 3000;
const app = express();

connectDatabase();
app.use(express.json());
app.use("/user", userRoute);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
