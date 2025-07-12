import { FormFields } from "../types/form";

export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const validateFormData = (data: FormFields): boolean => {
  return Boolean(
    data.login?.trim() &&
      data.password?.trim() &&
      data.fullName?.trim() &&
      data.email?.trim() &&
      data.phone?.trim() &&
      data.about?.trim()
  );
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
