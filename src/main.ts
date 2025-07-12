import express from "express";
import path from "path";
import { upload, uploadDir } from "./config/multer";
import { FormFields } from "./types/form";
import { logFormSubmission, validateFormData } from "./utils";
import multer from "multer";

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

    await logFormSubmission(data, file?.filename);

    res.json({
      ...data,
      avatarUrl: file ? `/uploads/${file.filename}` : null,
    });
  }
);

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
