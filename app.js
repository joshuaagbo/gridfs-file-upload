const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const port = process.env.PORT || 4300;
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const db = require("./config/db").mongoURI;
const {
  uploads
} = require("./config/multer_storage");

let gfs;
const conn = mongoose.createConnection(db, {
  useNewUrlParser: true
});
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
});
conn.on('err', (err) => {
  console.log('MONGO_ERROR:: ', err);
})

const app = express();
/******  MIDDLEWARES ******/
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// use session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
// use flash
app.use(flash());
// set messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.error = req.flash("error");
  next();
});

// SET VIEW ENGINE;
app.set("view engine", "pug");
// SET STATIC ASSET
app.use(express.static(path.resolve(__dirname, "statics")));
// ================================================================
// ROUTES
// GET-ROUTE
app.get("/", (req, res, next) => {
  gfs.files.find().sort({
    uploadDate: -1
  }).toArray((err, files) => {
    res.render("index", {
      files
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get('/images', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (files) {
      const isImage = files.filter(file => file.contentType === 'image/jpeg' || file.contentType === 'image/jpg' || file.contentType === 'image/png')
      res.render('image', {
        IMAGES: isImage
      });
    } else {
      res.status(400).json({
        error: "could Not get Images"
      });
    }
  });
});
app.get('/videos', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (files) {
      const isVideo = files.filter(file => file.contentType === 'video/jpeg' || file.contentType === 'video/mp4' || file.contentType === 'video/mp3')
      res.render('video', {
        VIDEOS: isVideo
      });
    } else {
      res.status(400).json({
        error: "could Not get Images"
      });
    }
  });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/image/:filename", (req, res, next) => {
  gfs.files.findOne({
      filename: req.params.filename
    },
    (err, file) => {
      if (err) {
        res.status(404).json({
          msg: "file NOT found"
        });
      } else {
        const createReadStream = gfs.createReadStream(file);
        createReadStream.pipe(res);
      }
    }
  );
});

app.get("/detail/:filename", (req, res) => {
  gfs.files.findOne({
      filename: req.params.filename
    },
    (err, file) => {
      if (err) throw err;
      if (!file) {
        req.flash('failure', 'file NOT found');
        res.redirect('/');
      } else {
        res.render('details', {
          file
        });
      }
    }
  );
});
// POST ROUTE;
app.post("/file/add", (req, res, next) => {
  uploads(req, res, err => {
    if (err) {
      req.flash("failure", err.msg);
      res.redirect("/add");
    } else {
      if (req.file) {
        console.log(req.file);
        req.flash("success", "file uploaded");
        res.redirect("/");
      } else {
        req.flash("failure", "file field is empty");
        res.redirect("/add");
      }
    }
  });
});

/******** APIs ******/
// app.get("/api/image/:filename", (req, res, next) => {
//   gfs.files.findOne({
//       filename: req.params.filename
//     },
//     (err, file) => {
//       if (err) {
//         res.status(404).json({
//           msg: "file NOT found"
//         });
//       } else {
//         const createReadStream = gfs.createReadStream(file);
//         createReadStream.pipe(res);
//       }
//     }
//   );
// });

// app.get("/api/files", (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     if (err) throw err;
//     if (!files) {
//       req.flash("error", "Images doesnt exist ");
//     } else {
//       res.status(200).json(files);
//     }
//   });
// });
/****** END API ******/
app.listen(port, () => console.log(`Server started at port ${port}`));