# Тестовое задание ITGrade

## Описание

Backend на Express + Prisma (SQLite), с отправкой писем через SMTP mail.ru, регистрацией пользователей и выдачей JWT.  
Frontend использует React, для взаимодействия с API.

---

## Переменные окружения

### Backend (`.env`)

```env
PORT=3000
SMTP_USER=your_email@mail.ru
SMTP_PASSWORD=your_app_password
JWT_SECRET=your_jwt_secret_here
```

Пароли для SMTP берутся здесь:
https://account.mail.ru/user/2-step-auth/passwords/

### Frontend (.env)

```env
VITE_BASE_URL=http://localhost:3000
```

### Установка и запуск

### Backend

Установить зависимости:

```bash
npm install
```

Выполнить миграции Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

или, если миграции уже созданы:

```bash
npx prisma migrate deploy
npx prisma generate
```

Запустить сервер:

```bash
npm run start
```

### Frontend

Установить зависимости:

```bash
npm install
```

Запустить dev сервер Vite:

```bash
npm run dev
```
