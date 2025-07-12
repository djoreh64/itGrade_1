import express from "express";
import path from "path";
import multer from "multer";
import cors from "cors";
import { upload, uploadDir } from "./config/multer";
import prisma from "./config/prismaClient";
import { FormFields } from "./types/form";
import { logFormSubmission, validateFormData } from "./utils";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));
app.use(cors());
app.use(express.json());

app.post(
  "/submit",
  (req, res, next) =>
    upload.single("avatar")(req, res, (err) => {
      if (err instanceof multer.MulterError || err instanceof Error)
        return res.status(400).json({ errors: { avatar: err.message } });
      next();
    }),
  async (req, res) => {
    const data = req.body as FormFields;
    const file = req.file;

    const validationErrors = validateFormData(data);
    if (Object.keys(validationErrors).length)
      return res.status(400).json({ errors: validationErrors });

    try {
      const user = await prisma.user.create({
        data: {
          login: data.login,
          password: data.password,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          about: data.about,
          avatarUrl: file ? `/uploads/${file.filename}` : null,
        },
      });

      await logFormSubmission(data, file?.filename);

      res.json({
        login: user.login,
        password: user.password,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        about: user.about,
        avatarUrl: user.avatarUrl,
      });
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target) {
        const errors: Record<string, string> = {};
        if (Array.isArray(error.meta.target))
          error.meta.target.forEach((field: string) => {
            if (field === "login") errors.login = "Этот логин уже занят";
            if (field === "email") errors.email = "Этот email уже занят";
          });
        return res.status(400).json({ errors });
      }
      console.error(error);
      res.status(500).json({ errors: { server: "Внутренняя ошибка сервера" } });
    }
  }
);

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        fullName: true,
        email: true,
        phone: true,
        about: true,
        avatarUrl: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errors: { server: "Ошибка при получении пользователей" } });
  }
});

app.listen(PORT, () =>
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`)
);
