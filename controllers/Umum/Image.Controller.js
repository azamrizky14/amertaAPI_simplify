const mongoose = require("mongoose");
const path = require('path');
const fs = require("fs");

// Upload Image Single
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ filename: req.file.filename });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Move Image From Temp to Destination
const moveTempImage = async (req, res) => {
  try {
    const { filename, finalLocation } = req.body;

    if (!filename || !finalLocation) {
        return res.status(400).json({ message: "Filename and finalLocation required" });
    }

    const tempPath = path.join(__dirname, '../images/temp', filename); // <--- temp di dalam images
    const finalPath = path.join(__dirname, '../images', finalLocation, filename);

    // Pastikan folder tujuan ada
    fs.mkdir(path.dirname(finalPath), { recursive: true }, (err) => {
        if (err) return res.status(500).json({ message: "Failed creating destination folder" });

        fs.rename(tempPath, finalPath, (err) => {
            if (err) {
                console.error("Failed moving file:", err);
                return res.status(500).json({ message: "Failed moving file" });
            }
            res.status(200).json({ message: "File moved successfully", finalFilename: path.basename(finalPath) });
        });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Remove Single Image From Temp
const removeTempImage = async (req, res) => {
  try {
    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({ message: "Filename required" });
    }

    const tempPath = path.join(__dirname, '../images/temp', filename);

    fs.unlink(tempPath, (err) => {
      if (err) {
        console.error(`Failed removing file ${filename}:`, err);
        return res.status(500).json({ message: `Failed removing file ${filename}` });
      }
      res.status(200).json({ message: "File removed successfully", filename });
    });

  } catch (error) {
    console.error("Error removing file:", error);
    return res.status(500).json({ message: error.message });
  }
};


// Move Multiple Images From Temp to Destination
const moveMultipleTempImages = async (req, res) => {
  try {
    const fileList = req.body; // harus array

    if (!Array.isArray(fileList) || fileList.length === 0) {
      return res.status(400).json({ message: "Array of filename and finalLocation required" });
    }

    const movePromises = fileList.map(file => {
      const { filename, finalLocation } = file;
      if (!filename || !finalLocation) {
        throw new Error("Filename and finalLocation required in each item");
      }

      const tempPath = path.join(__dirname, '../images/temp', filename);
      const finalPath = path.join(__dirname, '../images', finalLocation, filename);

      // Pastikan folder tujuan dibuat sebelum pindah
      return new Promise((resolve, reject) => {
        fs.mkdir(path.dirname(finalPath), { recursive: true }, (err) => {
          if (err) return reject("Failed creating destination folder");

          fs.rename(tempPath, finalPath, (err) => {
            if (err) {
              console.error(`Failed moving file ${filename}:`, err);
              return reject(`Failed moving file ${filename}`);
            }
            resolve({ filename, finalFilename: path.basename(finalPath) });
          });
        });
      });
    });

    const results = await Promise.all(movePromises);
    res.status(200).json({ message: "Files moved successfully", results });

  } catch (error) {
    console.error("Error moving files:", error);
    return res.status(500).json({ message: error.message });
  }
};

const removeMultipleTempImages = async (req, res) => {
  try {
    const fileList = req.body; // harus array

    if (!Array.isArray(fileList) || fileList.length === 0) {
      return res.status(400).json({ message: "Array of filename required" });
    }

    const removePromises = fileList.map(file => {
      const { filename } = file;
      if (!filename) {
        throw new Error("Filename required in each item");
      }

      const tempPath = path.join(__dirname, '../images/temp', filename);

      return new Promise((resolve, reject) => {
        fs.unlink(tempPath, (err) => {
          if (err) {
            console.error(`Failed removing file ${filename}:`, err);
            return reject(`Failed removing file ${filename}`);
          }
          resolve({ filename });
        });
      });
    });

    const results = await Promise.all(removePromises);
    res.status(200).json({ message: "Files removed successfully", results });

  } catch (error) {
    console.error("Error removing files:", error);
    return res.status(500).json({ message: error.message });
  }
};




module.exports = {
  // Stock
  uploadImage,
  moveTempImage,
  removeTempImage,

  moveMultipleTempImages,
  removeMultipleTempImages,
};
