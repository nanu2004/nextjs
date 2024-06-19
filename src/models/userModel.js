import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgetPasswordToken: {
    type: String,
    default: null,
  },
  forgetPasswordTokenExpiry: {
    type: Date,
    default: null,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  verifyTokenExpiry: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Ensure the model is not recreated if it already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
