import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./src/db/database.js";
dbConnection();

import authRouter from "./src/api/userAuth/userRouter.js";
import patientRouter from "./src/api/patientAuth/patientRouter.js";
import branchRouter from "./src/api/branchAuth/branchRouter.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 7000;

// routes
app.use("/api/auth", authRouter);
app.use("/api/auth", patientRouter);
app.use("/api/auth", branchRouter);

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
