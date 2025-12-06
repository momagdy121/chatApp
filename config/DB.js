import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

function connectToDatabase() {
  mongoose
    .connect(process.env.connect_url)
    .then(() => console.log("connected to Database"))
    .catch((error) => {
      console.error("Error connecting to database:", error);
    });
}

export default connectToDatabase;
