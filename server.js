const jsonServer = require("json-server");
const multer = require("multer");
const express = require("express");
const path = require("path");
const cors = require("cors");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;

// Add JSON and URL-encoded parsers
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));

// Serve uploaded files
server.use(express.static(path.join(__dirname, "files")));

// Multer storage with file type validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

const upload = multer({ storage: storage, fileFilter });

// Custom route for image upload
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type." });
  }
  res.status(200).json({
    path: `/files/${req.file.filename}`, // Ensure correct URL path
  });
});

// Use JSON Server middlewares and router
server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
