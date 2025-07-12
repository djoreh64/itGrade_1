import multer from "multer";
import path from "path";
import { Request } from "express";

export const uploadDir = path.resolve(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024;

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!ALLOWED_TYPES.includes(file.mimetype))
    return cb(new Error("Неподдерживаемый тип файла"));

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});
