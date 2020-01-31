const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

const connectDB = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("connected to db");
    })
    .catch(err => {
      console.log("error connecting db: " + err);
      process.exit(1);
    });
};

module.exports = connectDB;
