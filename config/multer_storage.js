const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const gridFsStorage = require("multer-gridfs-storage");
const db = require("./db").mongoURI;
const storage = new gridFsStorage({
  url: db,
  file: (req, file) => {
    // get filename
    const title = file.originalname.split('.').slice(0, 1);
    return {
      title: title.toString(),
      filename: `${file.fieldname}_${new Date().getTime()} ${path.extname(
        file.originalname
      )}`

    };
  }
});

const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // check file mime. && ext.
    checkType(file, cb);
  }
}).single("uploads");
// check file ext&&mimetype
checkType = (file, cb) => {
  const type = /jpg|jpeg|png|gif|mp3|mp4/;
  const extname = type.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = type.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb({
        msg: "file type NOT accepted"
      },
      null
    );
  }
};

module.exports = {
  uploads
};