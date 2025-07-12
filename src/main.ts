import express from "express";
import path from "path";
import { upload, uploadDir } from "./config/multer";
import { FormFields } from "./types/form";
import { logFormSubmission, validateFormData } from "./utils";
import multer from "multer";
import prisma from "./config/prismaClient";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));

app.post(
  "/submit",
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err instanceof multer.MulterError || err instanceof Error)
        return res.status(400).json({ errors: { avatar: err.message } });

      next();
    });
  },
  async (req, res) => {
    const data = req.body as FormFields;
    const file = req.file;

    const validationErrors = validateFormData(data);
    if (Object.keys(validationErrors).length > 0)
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
      if (error.code === "P2002") {
        return res.status(400).json({
          errors: {
            login: "Логин или email уже заняты",
            email: "Логин или email уже заняты",
          },
        });
      }
      console.error(error);
      res.status(500).json({ errors: { server: "Внутренняя ошибка сервера" } });
    }
  }
);

app.listen(PORT, () =>
  console.log(`Сервер запущен по адресу http://localhost:${PORT}`)
);
