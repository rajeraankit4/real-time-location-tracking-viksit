import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true, index: true },
});

export default mongoose.model("User", UserSchema);
