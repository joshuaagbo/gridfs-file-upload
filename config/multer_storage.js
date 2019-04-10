const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const gridFsStorage = require("multer-gridfs-storage");
const {
  mongodb
} = require("./keys");

// CREATE STORAGE ENGINE
const storage = new gridFsStorage({
  url: mongodb.mongoURI,
  file: (req, file) => {
    return {
      filename: `${file.fieldname}_${new Date().getTime()} ${path.extname(
        file.originalname
      )}`
    };
  }
});

const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkType(file, cb);
  }
}).single("uploads");
// check file ext&&mimetype
checkType = (file, cb) => {
  const type = /jpg|jpeg|png|gif|mp3|mp4/;
  const content = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp3', 'video/mp4'];
  const isContent = content.filter(t => t === file.mimetype);
  const extname = type.test(path.extname(file.originalname).toLowerCase());
  const mimetype = type.test(file.mimetype);

  if (extname && mimetype && file.mimetype == isContent[0]) {
    cb(null, true);
  } else {
    cb({
      msg: "file type NOT accepted"
    }, null);
  }
};

module.exports = {
  uploads
};