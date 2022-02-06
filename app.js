import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./src/db/database.js";
dbConnection();

import authRouter from "./src/api/userAuth/userRouter.js";
import adminRouter from "./src/api/adminAuth/adminAuth_router.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 7000;

// routes
app.use("/api/auth", authRouter);
app.use("/api/auth", adminRouter);

app.get("/", (_, res) => {
  res.json({ hello: "Hello" });
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
