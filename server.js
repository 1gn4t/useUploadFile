const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());

app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  console.log(file);

  if (!file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const newFileName = encodeURI(Date.now() + "_" + file.name);

  file.mv(`${__dirname}/client/public/uploads/${newFileName}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${newFileName}` });
  });
});

app.listen(5000, () => console.log("Server started on port 5000"));
