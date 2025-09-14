import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lang: { type: String, default: "en" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
