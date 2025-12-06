import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

async function connectToDatabase() {
  try {
    const connectionOptions = {
      // Recommended options for better connection handling
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(process.env.connect_url, connectionOptions);
    console.log("✅ Connected to Database");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Database disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ Database reconnected");
    });
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    throw error; // Re-throw to prevent server from starting without DB
  }
}

export default connectToDatabase;
