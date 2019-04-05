const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  uploads
} = require("./config/multer_storage");
const {
  gfs
} = require('./config/grid');

// ================================================================
// ROUTES
// verify if Auth
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('failure', 'Unauthorized')
    res.redirect('/sign-in');
  }
}
// GET-ROUTE
router.get("/", (req, res, next) => {
  gfs.files
    .find()
    .sort({
      uploadDate: -1
    })
    .toArray((err, files) => {
      res.render("index", {
        files
      });
    });
});
/****RENDER SIGNUP */
router.get("/sign-up", (req, res, next) => {
  res.render("sign-up");
});
/****RENDER SIGNIN */
router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});
/****RENDER ABOUT */
router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/images", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (files) {
      const isImage = files.filter(
        file =>
        file.contentType === "image/jpeg" ||
        file.contentType === "image/jpg" ||
        file.contentType === "image/png"
      );
      res.render("image", {
        IMAGES: isImage
      });
    } else {
      res.status(400).json({
        error: "could Not get Images"
      });
    }
  });
});
router.get("/videos", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if (files) {
      const isVideo = files.filter(
        file =>
        file.contentType === "video/jpeg" ||
        file.contentType === "video/mp4" ||
        file.contentType === "video/mp3"
      );
      res.render("video", {
        VIDEOS: isVideo
      });
    } else {
      res.status(400).json({
        error: "could Not get Images"
      });
    }
  });
});

router.get("/add", (req, res) => {
  res.render("add");
});

router.get("/file/:filename", (req, res, next) => {
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

router.get("/detail/:filename", (req, res) => {
  gfs.files.findOne({
      filename: req.params.filename
    },
    (err, file) => {
      if (err) throw err;
      if (!file) {
        req.flash("failure", "file NOT found");
        res.redirect("/");
      } else {
        res.render("details", {
          file
        });
      }
    }
  );
});
// POST ROUTE;

// KICK_START GOOGLE_OAUTH
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ['profile']
  })
);
// GOOGLE_AUTH_CB
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    //NEXT function
  }
);
// ADD
router.post("/file/add", (req, res, next) => {
  uploads(req, res, err => {
    if (err) {
      req.flash("failure", err.msg);
      res.redirect("/add");
    } else {
      if (req.file) {
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
// router.get("/api/image/:filename", (req, res, next) => {
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

// router.get("/api/files", (req, res) => {
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

module.exports = router;