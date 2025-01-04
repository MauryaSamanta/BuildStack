import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the User schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes extra spaces
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Ensure password is at least 6 characters long
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the User model
const User = model('User', userSchema);

export default User;
