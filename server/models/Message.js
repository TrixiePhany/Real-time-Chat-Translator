import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: String, required: true }, 
    room: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    text: { type: String, required: true },
    translated: { type: String }, 
    isDM: { type: Boolean, default: false },
    participants: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);