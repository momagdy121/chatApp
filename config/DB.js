import mongoose from "mongoose";

function connectToDatabase() {
  mongoose
    .connect(process.env.CONNECT_URL, { useNewUrlParser: true })
    .then(console.log("connected to Database"))
    .catch((error) => {
      console.log("failed to connect with the database");
    });
}

export default connectToDatabase;
