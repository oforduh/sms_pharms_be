import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dbConnection } from "./src/db/database.js";
dbConnection();

import router from "./src/api/auth/auth_router.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 8000;

// // routes
app.use(router);

app.get("/", (_, res) => {
  res.json({ hello: "Hello" });
});

app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
