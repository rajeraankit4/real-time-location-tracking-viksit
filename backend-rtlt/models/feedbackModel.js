import mongoose from "mongoose";

const feedbackModel = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackModel);
