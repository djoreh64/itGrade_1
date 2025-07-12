import path from "path";
import fs from "fs";
import { FormFields } from "../types/form";
import rateLimit from "express-rate-limit";

export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const validateFormData = (data: FormFields): Record<string, string> => {
  const errors: Record<string, string> = {};

  const loginRegex = /^[a-zA-Z0-9]{3,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

  const fullNameRegex = /^[А-Яа-яЁё\s\-]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;

  if (!data.login?.trim()) errors.login = "Логин обязателен";
  else if (!loginRegex.test(data.login))
    errors.login = "Минимум 3 латинские буквы или цифры";

  if (!data.password?.trim()) errors.password = "Пароль обязателен";
  else if (!passwordRegex.test(data.password))
    errors.password =
      "Пароль должен содержать минимум 8 символов, одну заглавную букву, одну строчную букву, одну цифру и один спецсимвол";

  if (!data.fullName?.trim()) errors.fullName = "ФИО обязательно";
  else if (!fullNameRegex.test(data.fullName))
    errors.fullName = "Ф.И.О. должно содержать минимум 3 буквы кириллицей";

  if (!data.email?.trim()) errors.email = "Email обязателен";
  else if (!emailRegex.test(data.email))
    errors.email = "Некорректный формат email";

  if (!data.phone?.trim()) errors.phone = "Телефон обязателен";
  else if (!phoneRegex.test(data.phone))
    errors.phone = "Телефон должен быть в формате +7 (999) 123-45-67";

  if (!data.about?.trim()) errors.about = "Поле обязательно";

  return errors;
};

export const logFormSubmission = async (
  data: FormFields,
  fileName: string | undefined,
  ip: string
): Promise<void> => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ip,
    data,
    avatar: fileName ?? null,
  };
  const logFilePath = path.resolve(__dirname, "../../logs/debug.log");

  const logLine = JSON.stringify(logEntry) + "\n";

  await fs.promises.mkdir(path.dirname(logFilePath), { recursive: true });
  await fs.promises.appendFile(logFilePath, logLine, "utf8");
};

export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    errors: {
      global:
        "Слишком много попыток регистрации с вашего IP. Пожалуйста, попробуйте позже.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
