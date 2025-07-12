import express, { Request, Response } from "express";
import path from "path";
import { upload, uploadDir } from "./config/multer";
import { FormFields } from "./types/form";
import { renderResult } from "./utils";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.static(path.resolve(__dirname, "../public")));
app.use("/uploads", express.static(uploadDir));

app.post("/submit", upload.single("avatar"), (req: Request, res: Response) => {
  const data = req.body as FormFields;
  const file = req.file;

  res.send(renderResult(data, file));
});

app.listen(PORT, () =>
  console.log(`Сервер запущен на http://localhost:${PORT}`)
);
