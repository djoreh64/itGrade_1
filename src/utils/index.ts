import path from "path";
import fs from "fs";
import { FormFields } from "../types/form";

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
  const fullNameRegex = /^[А-Яа-яЁё\s\-]+$/;
  const loginRegex = /^[a-zA-Z0-9]{3,}$/;

  if (!data.login?.trim()) errors.login = "Логин обязателен";
  else if (!loginRegex.test(data.login))
    errors.login =
      "Логин должен содержать только латинские буквы и цифры (минимум 3 символа)";

  if (!data.password?.trim()) errors.password = "Пароль обязателен";

  if (!data.fullName?.trim()) errors.fullName = "Ф.И.О. обязательно";
  else if (!fullNameRegex.test(data.fullName))
    errors.fullName = "Ф.И.О. должно содержать только буквы и пробелы";

  if (!data.email?.trim()) errors.email = "Email обязателен";
  else if (!emailRegex.test(data.email))
    errors.email = "Некорректный формат email";

  if (!data.phone?.trim()) errors.phone = "Телефон обязателен";
  else if (!phoneRegex.test(data.phone))
    errors.phone = "Телефон должен быть в формате +7 (999) 123-45-67";

  if (!data.about?.trim()) errors.about = "Поле «О себе» обязательно";

  return errors;
};

export const renderResult = (
  data: FormFields,
  file?: Express.Multer.File
): string => {
  const { login, password, fullName, email, phone, about } = data;

  return `
    <h1>Вы отправили:</h1>
    <ul>
      <li><b>Логин:</b> ${escapeHtml(login)}</li>
     <li><b>Пароль:</b> ${escapeHtml(password)}</li>
      <li><b>ФИО:</b> ${escapeHtml(fullName)}</li>
      <li><b>Email:</b> ${escapeHtml(email)}</li>
      <li><b>Телефон:</b> ${escapeHtml(phone)}</li>
      <li><b>О себе:</b> ${escapeHtml(about)}</li>
      ${
        file
          ? `<li><b>Аватар:</b><br /><img src="/uploads/${file.filename}" width="150" /></li>`
          : `<li><b>Аватар:</b> не загружен</li>`
      }
    </ul>
    <a href="/">← Назад</a>
  `;
};

export const logFormSubmission = async (
  data: FormFields,
  fileName?: string
): Promise<void> => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    data,
    avatar: fileName ?? null,
  };
  const logFilePath = path.resolve(__dirname, "../../logs/debug.log");

  const logLine = JSON.stringify(logEntry) + "\n";

  await fs.promises.mkdir(path.dirname(logFilePath), { recursive: true });
  await fs.promises.appendFile(logFilePath, logLine, "utf8");
};
