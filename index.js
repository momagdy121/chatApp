import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import ListenToServer from "./config/server.js";
import connectToDatabase from "./config/DB.js";
import globalErrorHandler from "./middlewares/globalErrorhandler.js";
import ApiError from "./Utils/apiError.js";
import { app } from "./socket.io/socket.js";

import messageRouter from "./routes/messageRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import groupRouter from "./routes/groupRouter.js";
import storyRouter from "./routes/storyRouter.js";

dotenv.config({ path: "./config.env" });

ListenToServer();
connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
app.use("/api/stories", storyRouter);

app.all("*", (req, res, next) => {
  return next(new ApiError(`can't find ${req.url}`, 404));
});

app.use(globalErrorHandler);

export default app;
