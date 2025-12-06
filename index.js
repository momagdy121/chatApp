import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import startServer from "./config/server.js";
import globalErrorHandler from "./middlewares/globalErrorhandler.js";
import globalErrors from "./errors/globalErrors.js";
import { app } from "./socket.io/socket.js";

import messageRouter from "./routes/messageRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import groupRouter from "./routes/groupRouter.js";
import storyRouter from "./routes/storyRouter.js";

// Load environment variables first
dotenv.config({ path: "./config.env" });

// Configure Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Routes
app.get("/", (req, res, next) => {
  res.send("Welcome to Chat Application API");
});
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
app.use("/api/stories", storyRouter);

// 404 handler
app.all("*", (req, res, next) => {
  return next(globalErrors.routeNotFound(req.url));
});

// Global error handler (must be last)
app.use(globalErrorHandler);

// Start the application
startServer();

export default app;
