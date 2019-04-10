const express = require('express');
const router = express.Router();
const passport = require('passport');
const Grid = require("gridfs-stream");
const {
  mongoURI
} = require('./config/keys').mongodb;
const {
  User
} = require('./model/schema');
const mongoose = require('mongoose');
const authGithub = require('./config/auth_github')(passport);
const {
  uploads
} = require("./config/multer_storage");
// GFS CONFIG
let gfs;
const conn = mongoose.createConnection(mongoURI);
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
});
// ================================================================
// ROUTES
// verify Auth
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('failure', 'Unauthorized, you are not signed in')
    res.redirect('/sign-in');
  }
};

// GET-ROUTE
router.get("/", (req, res, next) => {
  gfs.files
    .find()
    .sort({
      uploadDate: -1
    })
    .toArray((err, files) => {
      res.render("index", {
        files,
        user: req.user
      });
    });
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
      // return only video files
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

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add", {
    user: req.user
  });
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
          file,
          user: req.user
        });
      }
    }
  );
});
router.get('/user/profile/:id', ensureAuthenticated, (req, res) => {
  if (req.user._id != req.params.id.toString()) {
    req.flash('failure', 'Not Allowed');
    res.redirect('/sign-in');
  } else {
    User.findById(req.params.id)
      .then(user => {
        res.render('profile', {
          user: user
        })
      })
      .catch(err => res.status(400).json(err));
  }
})
// AUTHENTICATION AND AUTHORIZATION
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ['profile']
  })
);
// G_AUTH_CB
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureFlash: true,
    failureRedirect: '/sign-in'
  }),
  (req, res) => {
    if (req.user) {
      req.flash('success', 'You are signed in');
      res.redirect('/');
    }
  });
// _START GHUB_OAUTH
router.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ['profile']
  })
);
// GHUB_AUTH_CB
router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureFlash: true,
    failureRedirect: '/sign-in'
  }),
  (req, res) => {
    if (req.user) {
      req.flash('success', 'You are signed in');
      res.redirect('/');
    }

  });
// ADD
router.post("/file/add", ensureAuthenticated, (req, res) => {
  uploads(req, res, err => {
    if (err) {
      req.flash("failure", err.msg);
      res.redirect("/add");
    } else {
      if (req.file) {
        req.flash("success", "upload successful");
        res.redirect("/");
      } else {
        req.flash("failure", "file field is empty");
        res.redirect("/add");
      }
    }
  });
});
// logout 
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success", "you have been logged out");
  res.redirect("/sign-in");
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