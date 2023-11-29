import mongoose from "mongoose";
import validator from "validator";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    otp: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model("otp", otpSchema);
