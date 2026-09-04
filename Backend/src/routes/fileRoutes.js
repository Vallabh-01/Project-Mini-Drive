import express from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "node:crypto";

import { protect } from "../middleware/authMiddleware.js";

import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  getTrashedFiles,
  restoreFile,
  deleteFilePermanently,
  getFavoriteFiles,
  setFavorite
} from "../controllers/fileController.js";

const router = express.Router();

/*
 * Maximum size for a single uploaded file.
 *
 * Default: 50 MB
 *
 * it can override this with:
 * MAX_UPLOAD_BYTES=52428800
 */
const MAX_UPLOAD_BYTES = Number(
  process.env.MAX_UPLOAD_BYTES || 50 * 1024 * 1024
);

if (!Number.isSafeInteger(MAX_UPLOAD_BYTES) || MAX_UPLOAD_BYTES <= 0) {
  throw new Error("MAX_UPLOAD_BYTES must be a positive integer");
}

/*
 * Block executable/script-like file extensions.
 *
 * This is only the first layer of validation.
 * Later i will add actual file-content/MIME validation.
 */
const BLOCKED_EXTENSIONS = new Set([
  ".ade",
  ".adp",
  ".app",
  ".asp",
  ".aspx",
  ".bas",
  ".bat",
  ".cab",
  ".cmd",
  ".com",
  ".cpl",
  ".crt",
  ".dll",
  ".exe",
  ".hta",
  ".inf",
  ".ins",
  ".isp",
  ".jar",
  ".js",
  ".jse",
  ".lnk",
  ".mjs",
  ".msi",
  ".msp",
  ".mst",
  ".ocx",
  ".php",
  ".ps1",
  ".reg",
  ".scr",
  ".sct",
  ".sh",
  ".sys",
  ".vb",
  ".vbe",
  ".vbs",
  ".wsc",
  ".wsf",
  ".wsh"
]);

/*
 * Store files using a server-generated random filename.
 *
 * We NEVER use the original client-controlled filename
 * as the actual filename on disk.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();

    cb(null, `${randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 1
  },

  fileFilter: (_req, file, cb) => {
    const extension = path
      .extname(file.originalname || "")
      .toLowerCase();

    if (BLOCKED_EXTENSIONS.has(extension)) {
      return cb(new Error("This file type is not allowed"));
    }

    cb(null, true);
  }
});

/*
 * Wrap Multer so upload errors return controlled responses
 * instead of leaking internal errors to the client.
 */
const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: `File is too large. Maximum allowed size is ${
            MAX_UPLOAD_BYTES / (1024 * 1024)
          } MB.`
        });
      }

      if (
        err.code === "LIMIT_FILE_COUNT" ||
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        return res.status(400).json({
          message: "Only one file may be uploaded per request."
        });
      }

      if (err.code === "LIMIT_PART_COUNT") {
        return res.status(400).json({
          message: "Invalid multipart upload."
        });
      }

      return res.status(400).json({
        message: "Invalid file upload."
      });
    }

    return res.status(400).json({
      message: err.message || "Invalid file upload."
    });
  });
};

// Upload & list
router.post("/upload", protect, handleUpload, uploadFile);

router.get("/", protect, getFiles);

// Recycle Bin
router.get("/trash", protect, getTrashedFiles);

router.patch("/:id/restore", protect, restoreFile);

router.delete("/:id/permanent", protect, deleteFilePermanently);

// Favorites
router.get("/favorites", protect, getFavoriteFiles);

router.patch("/:id/favorite", protect, setFavorite);

// File operations
router.get("/:id/download", protect, downloadFile);

router.delete("/:id", protect, deleteFile); // keep last

export default router;