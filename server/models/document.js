import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled document", trim: true },
    content: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["editor", "viewer"], default: "editor" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);