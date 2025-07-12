import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { upload, uploadDir } from "./config/multer";
import prisma from "./config/prismaClient";
import { FormFields } from "./types/form";
import {
  logFormSubmission,
  registrationLimiter,
  validateFormData,
} from "./utils";
import { sendWelcomeEmail } from "./config/emailService";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? "supersecret";

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));
app.use(cors());
app.use(express.json());

const uploadAvatar = (req: Request, res: Response, next: NextFunction) =>
  upload.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError || err instanceof Error) {
      return res.status(400).json({ errors: { avatar: err.message } });
    }
    next();
  });

const getClientIp = (req: Request): string =>
  (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";

const generateToken = (userId: number, login: string) =>
  jwt.sign({ userId, login }, JWT_SECRET, { expiresIn: "7d" });

app.post("/submit", registrationLimiter, uploadAvatar, async (req, res) => {
  const data = req.body as FormFields;
  const file = req.file;

  const errors = validateFormData(data);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        login: data.login,
        password: hashedPassword,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        about: data.about,
        avatarUrl: file ? `/uploads/${file.filename}` : null,
      },
    });

    try {
      await sendWelcomeEmail(user.email, user.fullName);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    const ip = getClientIp(req);
    await logFormSubmission(data, file?.filename, ip);

    const token = generateToken(user.id, user.login);

    return res.json({
      user: {
        login: user.login,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        about: user.about,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error: any) {
    if (error.code === "P2002" && Array.isArray(error.meta?.target)) {
      const errors: Record<string, string> = {};
      error.meta.target.forEach((field: string) => {
        if (field === "login") errors.login = "Этот логин уже занят";
        if (field === "email") errors.email = "Этот email уже занят";
      });
      return res.status(400).json({ errors });
    }

    console.error(error);
    return res
      .status(500)
      .json({ errors: { server: "Внутренняя ошибка сервера" } });
  }
});

app.get("/users", async (req, res) => {
  try {
    const offset = Math.max(0, parseInt(req.query.offset as string) || 0);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: offset,
        take: limit,
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
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: { total: totalCount, offset, limit },
    });
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
