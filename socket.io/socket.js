import { Server } from "socket.io";
import { createServer } from "http";
import { verifyIoToken } from "./middlewares.js";
import { handleConnection } from "./handlers/connectionHandler.js";
import express from "express";

export const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "https://localhost:5000",
    methods: "*",
    credentials: true,
  },
});

// Middleware for verifying socket connections
io.use(async (socket, next) => {
  await verifyIoToken(socket, next);
  next();
});

io.on("connection", async (socket) => handleConnection(io, socket)); // Pass the io instance

export default server;
