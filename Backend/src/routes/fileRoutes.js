import express from "express";
import multer from "multer";
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Upload & list
router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);

// Recycle Bin
router.get("/trash", protect, getTrashedFiles);
router.patch("/:id/restore", protect, restoreFile);
router.delete("/:id/permanent", protect, deleteFilePermanently);

// Favorites
router.get("/favorites", protect, getFavoriteFiles);
router.patch("/:id/favorite", protect, setFavorite);

// File ops
router.get("/:id/download", protect, downloadFile);
router.delete("/:id", protect, deleteFile); // keep last

export default router;
