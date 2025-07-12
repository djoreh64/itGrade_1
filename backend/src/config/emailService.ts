import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Ошибка подключения к SMTP:", error);
  } else {
    console.log("SMTP готов к работе");
  }
});

export const sendWelcomeEmail = async (to: string, fullName: string) => {
  try {
    await transporter.sendMail({
      from: `"ITGrade" <${process.env.SMTP_USER}>`,
      to,
      subject: "Добро пожаловать!",
      text: `Привет, ${fullName}! Спасибо за регистрацию.`,
      html: `<p>Привет, <b>${fullName}</b>! Спасибо за регистрацию.</p>`,
    });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
  }
};
