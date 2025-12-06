import { server } from "../socket.io/socket.js";
import connectToDatabase from "./DB.js";
import mongoose from "mongoose";

/**
 * Starts the server after ensuring database connection
 * Handles graceful shutdown on SIGTERM and SIGINT
 */
const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();

    // Start server after successful database connection
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      
      // Close server first (stop accepting new connections)
      server.close(async () => {
        console.log("✅ HTTP server closed");
        
        // Close database connection
        try {
          await mongoose.connection.close();
          console.log("✅ Database connection closed");
        } catch (err) {
          console.error("❌ Error closing database connection:", err);
        }
        
        console.log("✅ Process terminated");
        process.exit(0);
      });

      // Force close after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error("⚠️ Forcing shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Register shutdown handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Promise Rejection:", err);
      gracefulShutdown("unhandledRejection");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      gracefulShutdown("uncaughtException");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

export default startServer;

