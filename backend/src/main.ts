import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

import { uploadDir } from "./config/multer";
import { registrationLimiter, uploadAvatar } from "./utils";
import Users from "./controllers/Users";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));
app.use(cors());
app.use(express.json());

app.post("/submit", registrationLimiter, uploadAvatar, Users.register);
app.get("/users", Users.getAll);

app.listen(PORT, () =>
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`)
);
