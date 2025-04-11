// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV !== "production";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: isDev ? "http://localhost:8080" : process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API routes
app.use("/api/auth", authRoutes);

// Serve frontend
if (!isDev) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// Create HTTP server for both Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: isDev ? "http://localhost:8080" : process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// WebRTC signaling handlers
io.on('connection', (socket) => {
  console.log('User connected to signaling server:', socket.id);

  socket.on("join-room", ({ roomId, role }) => {
    console.log(`Socket ${socket.id} with role ${role} joined ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);

    const roomClients = io.sockets.adapter.rooms.get(roomId);
    if (roomClients && roomClients.size > 1) {
      socket.emit("user-joined", "existing-user");
    }
  });

  socket.on("offer", (data) => {
    socket.to(data.room).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.to(data.room).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.room).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`🚀 Server (API + WebRTC) running on port ${PORT} in ${isDev ? "development" : "production"} mode`);
});
