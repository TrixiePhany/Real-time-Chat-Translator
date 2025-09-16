import express from "express";
import jwt from "jsonwebtoken";
import Group from "../models/Group.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware: check JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Create group
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members.length)
      return res.status(400).json({ error: "Name and members required" });

    const group = new Group({
      name,
      members: [req.user.id, ...members], 
      createdBy: req.user.id,
    });

    await group.save();

    res.json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("members", "username lang email"); 
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
