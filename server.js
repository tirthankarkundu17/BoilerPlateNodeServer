const express = require("express");
const multer = require("multer");
const app = express();
const path = require("path");
const request = require("request");
const fs = require("fs");
const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

//Handle Errors
const handleError = (err, res) => {
  let response = new Object();
  response.status = "Error";
  response.message = err;
  res
    .status(500)
    .json(response);
};

app.use("/js", express.static(path.join(__dirname, "assets")));

const upload = multer({
  dest: "./upload/"
});

//Show the index page for uploading files. Nothing fancy with design
app.get("/upload", (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.post("/chat", (req, res) => {
  console.log("hi", req.body);
  res.send("Hi");
})

app.get("/posts", (req, res) => {
  request('https://jsonplaceholder.typicode.com/posts', function (error, response, body) {
    res.json(JSON.parse(body));
  });
})

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      "./upload/" + req.file.originalname
    );

    if (
      path.extname(req.file.originalname).toLowerCase() === ".png" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpeg"
    ) {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        var images_file = fs.createReadStream(
          "./upload/" + req.file.originalname
        );
      });
      let response = new Object();
      response.status = "Success";
      // response.status = "Error";
      response.message = "Successfully saved the file";
      res.status(201).json(response);
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        let response = new Object();
        response.status = "Error";
        response.message = "Only .png or .jpg or .jpeg files are allowed!";
        res
          .status(403)
          .json(response);
      });
    }
  }
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
