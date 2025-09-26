import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 },
});

export default mongoose.model("User", UserSchema);
