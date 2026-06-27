const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "test",
    });

    console.log("MongoDB Connected:", conn.connection.name);
  } catch (error) {
    console.log("FULL ERROR =>");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;