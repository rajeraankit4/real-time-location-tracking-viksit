import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  googleId: String,
});

export default mongoose.model("User", UserSchema);
