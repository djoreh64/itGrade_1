import bcrypt from "bcrypt";
import prisma from "../config/prismaClient";

import { Request, Response } from "express";
import { FormFields } from "../types/form";
import {
  generateToken,
  getClientIp,
  logFormSubmission,
  validateFormData,
} from "../utils";

import { sendWelcomeEmail } from "../config/emailService";

const Users = {
  register: async (req: Request, res: Response) => {
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
        console.error("Ошибка при отправке письма:", emailErr);
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
  },

  getAll: async (req: Request, res: Response) => {
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
  },
};

export default Users;
