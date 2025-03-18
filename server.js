const jsonServer = require("json-server");
const multer = require("multer");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3200;

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Custom route for image upload
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded or invalid file type.");
  }
  //   if (!req.files) {
  //     return res.status(400).send("No file uploaded or invalid file type.");
  //   }
  res.send(JSON.stringify(req.file));
});

server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
