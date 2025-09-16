import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import axios from "axios";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/group.js";
import Message from "./models/Message.js";
import Group from "./models/Group.js";
import userRoutes from "./routes/user.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8001;

const userLanguages = {};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    userLanguages[socket.id] = decoded.lang || "en";
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("joinRoom", async ({ room }) => {
    try {
      const group = await Group.findById(room);
      if (!group) return socket.emit("error", "Group not found");

      socket.join(room);
      console.log(`${socket.user.username} joined ${group.name}`);

      const history = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(20);
      socket.emit("chatHistory", history.reverse());
    } catch (err) {
      console.error("❌ joinRoom error:", err.message);
    }
  });

   socket.on("joinDirectRoom", ({ from, to }) => {
    const roomName = [from, to].sort().join("_dm_");
    socket.join(roomName);
    console.log(`${from} joined DM room with ${to}`);

    Message.find({
      isDM: true,
      participants: { $all: [from, to] },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .then((history) => {
        socket.emit("chatHistory", history.reverse());
      });
  });

  socket.on("sendMessage", async ({ text, room }) => {
    try {
      const sender = socket.user?.username || "Unknown";

      const newMsg = new Message({
        sender,
        room,
        text,
        translated: text, 
        isDm: false,
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
    } catch (err) {
      console.error("❌ sendMessage error:", err.message);
    }
  });

  socket.on("sendDM", async ({ text, from, to }) => {
    const roomName = [from, to].sort().join("_dm_");

    const newMsg = new Message({
      sender: from,
      text,
      isDM: true,
      participants: [from, to],
    });
    await newMsg.save();

    io.to(roomName).emit("receiveMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("☠️ Client disconnected:", socket.id);
    delete userLanguages[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`🌸 Server running on http://localhost:${PORT}`);
});
