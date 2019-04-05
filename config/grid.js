const Grid = require("gridfs-stream");
const dburl = require('./db').mongoURI;
const mongoose = require('mongoose');

const gfs = new Grid();
const conn = mongoose.createConnection(dburl);
conn.once('open', () => {
  gfs.db = conn.db;
  gfs.mongo = mongoose.mongo;
});

module.exports = {
  gfs
}