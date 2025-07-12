
export const validateEmail = (value: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(value)) return "Некорректный email";
  return true;
};

export const validatePhone = (value: string) => {
  if (!value) return "Телефон обязателен";
  if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(value))
    return "Телефон в формате +7 (XXX) XXX-XX-XX";
  return true;
};

export const validatePassword = (value: string) => {
  if (!value) return "Пароль обязателен";
  if (!/^[a-zA-Z0-9_@#$%!\-]+$/.test(value))
    return "Пароль может содержать только латиницу, цифры и символы _ @ # $ % ! -";
  return true;
};

export const validateFullName = (value: string) => {
  const trimmed = value.trim();
  const words = trimmed.split(/\s+/);
  if (words.length !== 3) return "ФИО должно содержать ровно 3 слова";

  const namePattern = /^[А-ЯЁ][а-яё\-]*$/;

  if (!words.every((w) => namePattern.test(w)))
    return "Каждое слово должно начинаться с большой буквы и содержать только кириллицу и дефисы";

  return true;
};
