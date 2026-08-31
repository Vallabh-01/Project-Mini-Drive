import File from "../models/File.js";
import fs from "fs";
import path from "path";

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, size, filename, path: filepath } = req.file;

    const newFile = new File({
      filename,
      originalname,
      path: filepath,
      mimetype,
      size,
      uploadedBy: req.user._id
    });

    await newFile.save();
    res.status(201).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// List active (non-trashed) files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      uploadedBy: req.user._id,
      isTrashed: false
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files", error: error.message });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(process.cwd(), file.path.replace(/\\/g, "/"));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, file.filename);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soft delete -> recycle bin
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.isTrashed = true;
    await file.save();

    res.json({ message: "File moved to recycle bin" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};

// Get trashed files
export const getTrashedFiles = async (req, res) => {
  try {
    const trashedFiles = await File.find({
      uploadedBy: req.user._id,
      isTrashed: true
    }).sort({ createdAt: -1 });

    res.status(200).json(trashedFiles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trashed files", error: error.message });
  }
};

// Restore file
export const restoreFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.isTrashed = false;
    await file.save();

    res.json({ message: "File restored successfully" });
  } catch (err) {
    res.status(500).json({ message: "Restore failed" });
  }
};

// Permanent delete
export const deleteFilePermanently = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    const filePath = path.join(process.cwd(), file.path.replace(/\\/g, "/"));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();
    res.json({ message: "File deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Permanent delete failed" });
  }
};

/* Favorites */
export const getFavoriteFiles = async (req, res) => {
  try {
    const files = await File.find({
      uploadedBy: req.user._id,
      isTrashed: false,
      isFavorite: true
    }).sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err.message });
  }
};

export const setFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;
    if (typeof isFavorite !== "boolean") {
      return res.status(400).json({ message: "isFavorite must be boolean" });
    }
    const file = await File.findOne({ _id: id, uploadedBy: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    file.isFavorite = isFavorite;
    await file.save();

    res.json({ message: "Favorite updated", file });
  } catch (err) {
    res.status(500).json({ message: "Failed to update favorite", error: err.message });
  }
};
