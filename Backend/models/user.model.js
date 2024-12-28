import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Ensures a 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    role: {
      type: String,
      required: true,
    },
    profile: {
      bio: { type: String, default: "" },
      skills: [
        {
          type: String,
          validate: {
            validator: function (v) {
              return v.trim().length > 0; // Ensures non-empty skill names
            },
            message: (props) => `Skill name cannot be empty.`,
          },
        },
      ],
      resume: { type: String, default: "" },
      resumeOriginalName: { type: String, default: "" },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "/images/default-profile.png", // Default path for profile photo
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
