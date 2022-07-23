const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth");
const userRoute = require("./routes/User");
const postRoute = require("./routes/Post");
const categoryRoute = require("./routes/Category");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({ origin: true }));
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded!");
});

app.use("/auth", authRoute);
app.use("/update-user", userRoute);
app.use("/post", postRoute);
app.use("/category", categoryRoute);

app.listen(PORT, () => {
  console.log("Server is running...");
});
