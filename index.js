const express = require("express");
const userRoute = require("./src/routes/user.routes")

const app = express();

app.use("/soma", userRoute);

app.listen(3000)