const File = require('../models/File');
const fs = require('fs');

// @desc    Get all files
// @route   GET /api/files
// @access  Public
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find();

    return res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Upload a file
// @route   POST /api/files
// @access  Public
exports.uploadFile = async (req, res, next) => {
  try {
    const { originalname, path, size } = req.file;

    const newFile = await File.create({
      name: originalname,
      path,
      size,
    });

    return res.status(201).json({
      success: true,
      data: newFile,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Public
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    fs.unlink(file.path, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          error: 'Server Error',
        });
      }

      await file.remove();

      return res.status(200).json({
        success: true,
        data: {},
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Download a file
// @route   GET /api/files/:id
// @access  Public
exports.downloadFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    res.download(file.path, file.name);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};