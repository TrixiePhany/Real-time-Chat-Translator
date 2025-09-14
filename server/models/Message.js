import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: String, 
      required: true,
    },
    room: {
      type: String, 
      required: true,
    },
    text: {
      type: String, 
      required: true,
    },
    translated: {
      type: String, 
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
