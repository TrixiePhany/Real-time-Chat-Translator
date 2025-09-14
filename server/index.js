import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";
import jwt from "jsonwebtoken";
import Message from "./models/Message.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const userLanguages = {}; 
const roomUsers = {}; 

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8001;

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // attach user info
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  // join room
  socket.on("joinRoom", async ({ room }) => {
    const { username, lang, id } = socket.user;

    socket.join(room);
    userLanguages[socket.id] = lang || "en";

    if (!roomUsers[room]) roomUsers[room] = [];
    roomUsers[room].push({ id: socket.id, name: username, lang });

    console.log(`${username} joined ${room} with language ${lang}`);

    // 20 messages from DB
    const history = await Message.find({ room }).sort({ createdAt: -1 }).limit(20);
    socket.emit("chatHistory", history.reverse());

    // broadcast updated users
    io.to(room).emit("roomUsers", roomUsers[room]);
  });

  // send + save message
  socket.on("sendMessage", async ({ text, room }) => {
  const { username, id, lang } = socket.user;
  const sender = username;

  const newMsg = new Message({
    sender,
    room,
    text,
    translated: text, 
    owner: id,
  });
  await newMsg.save();

  const socketsInRoom = await io.in(room).fetchSockets();

  socketsInRoom.forEach(async (client) => {
    const targetLang = userLanguages[client.id] || "en";
    let translated = text;

    try {
      if (targetLang !== "en") {
        const res = await axios.post("https://libretranslate.de/translate", {
          q: text,
          source: "en",
          target: targetLang,
          format: "text",
        });
        translated = res.data.translatedText;
      }
    } catch (err) {
      console.error("❌ Translation failed:", err.message);
    }

    io.to(client.id).emit("receiveMessage", {
      sender,
      text,
      translated,
      room,
      createdAt: newMsg.createdAt,
    });
  });
});


  // disconnect
  socket.on("disconnect", () => {
    console.log("☠️ Client disconnected:", socket.id);

    for (const room in roomUsers) {
      roomUsers[room] = roomUsers[room].filter((u) => u.id !== socket.id);
      io.to(room).emit("roomUsers", roomUsers[room]);
    }

    delete userLanguages[socket.id];
  });
});

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
