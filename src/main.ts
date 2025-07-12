import express, { Request, Response } from "express";
import path from "path";
import { upload, uploadDir } from "./config/multer";
import { FormFields } from "./types/form";
import { logFormSubmission, validateFormData } from "./utils";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));

app.post("/submit", upload.single("avatar"), async (req: Request, res: Response) => {
  const data = req.body as FormFields;
  const file = req.file;

  if (!validateFormData(data))
    return res.status(400).send("Ошибка: обязательные поля не заполнены");

  try {
    await logFormSubmission(data, file?.filename);
  } catch (err) {
    console.error("Ошибка:", err);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.json({
    ...data,
    avatarUrl: file ? `/uploads/${file.filename}` : null,
  });
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
