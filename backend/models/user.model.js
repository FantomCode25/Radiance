// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "widowed","other"],
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;