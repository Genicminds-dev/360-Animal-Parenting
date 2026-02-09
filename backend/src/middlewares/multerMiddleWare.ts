import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const IMAGE_LIMIT = 5 * 1024 * 1024;
const PDF_LIMIT = 5 * 1024 * 1024;
const VIDEO_LIMIT = 50 * 1024 * 1024;
const TOTAL_LIMIT = 150 * 1024 * 1024;

const allowedImageExt = [".jpg", ".jpeg", ".png", ".webp"];
const allowedImageMime = ["image/jpeg", "image/png", "image/webp"];

const allowedVideoExt = [".mp4", ".mov", ".avi", ".mkv"];
const allowedVideoMime = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];

const allowedPdfExt = [".pdf"];
const allowedPdfMime = ["application/pdf"];

export const FIELD_RULES: Record<
  string,
  {
    label: string;
    types: ("image" | "pdf" | "video")[];
  }
> = {
  profileImg: {
    label: "Profile image",
    types: ["image"],
  },
  aadhaarFile: {
    label: "Aadhaar file",
    types: ["image", "pdf"],
  },
};

const isValidImage = (file: Express.Multer.File) =>
  allowedImageExt.includes(path.extname(file.originalname).toLowerCase()) &&
  allowedImageMime.includes(file.mimetype);

const isValidPdf = (file: Express.Multer.File) =>
  allowedPdfExt.includes(path.extname(file.originalname).toLowerCase()) &&
  allowedPdfMime.includes(file.mimetype);

const isValidVideo = (file: Express.Multer.File) =>
  allowedVideoExt.includes(path.extname(file.originalname).toLowerCase()) &&
  allowedVideoMime.includes(file.mimetype);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "public/uploads/files";

    if (file.mimetype.startsWith("image/")) {
      uploadPath = "public/uploads/images";
    } else if (file.mimetype === "application/pdf") {
      uploadPath = "public/uploads/documents";
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath = "public/uploads/videos";
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: VIDEO_LIMIT,
  },
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".psd") {
      return cb(new Error("PSD files are not allowed"));
    }

    const rule = FIELD_RULES[file.fieldname];

    if (!rule) {
      return cb(
        new Error(`Upload not allowed for field: ${file.fieldname}`)
      );
    }

    const { label, types } = rule;

    const isValid =
      (types.includes("image") && isValidImage(file)) ||
      (types.includes("pdf") && isValidPdf(file)) ||
      (types.includes("video") && isValidVideo(file));

    if (!isValid) {
      return cb(
        new Error(
          `Invalid file type for ${label}. Allowed types: ${types.join(", ")}`
        )
      );
    }

    cb(null, true);
  },
});

export const validateUploadedFiles = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Record<string, Express.Multer.File[]>;
  let totalSize = 0;

  if (!files) return next();

  for (const field in files) {
    for (const file of files[field]) {
      totalSize += file.size;

      if (file.mimetype.startsWith("image/") && file.size > IMAGE_LIMIT) {
        cleanupFiles(req);
        return res.status(400).json({ message: "Image must be under 5MB" });
      }

      if (file.mimetype === "application/pdf" && file.size > PDF_LIMIT) {
        cleanupFiles(req);
        return res.status(400).json({ message: "PDF must be under 5MB" });
      }

      if (file.mimetype.startsWith("video/") && file.size > VIDEO_LIMIT) {
        cleanupFiles(req);
        return res.status(400).json({ message: "Video must be under 50MB" });
      }
    }
  }

  if (totalSize > TOTAL_LIMIT) {
    cleanupFiles(req);
    return res.status(400).json({
      message: "Total upload size must be under 150MB",
    });
  }

  next();
};

export const cleanupFiles = (req: Request) => {
  const files = req.files as Record<string, Express.Multer.File[]>;
  if (!files) return;

  for (const field in files) {
    for (const file of files[field]) {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }
};

export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    const files = req.files as Record<string, Express.Multer.File[]>;
    if (files) {
      Object.values(files).flat().forEach((file) => {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};
