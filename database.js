const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((db) => console.log("Database Connect..."))
    .catch((e) => console.log(e));
};

module.exports = connectDb;
