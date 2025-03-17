import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  provider: { type: String, default: 'credentials' }, // 'google' or 'credentials'
  isBlocked: { type: Boolean, default: false }, // Add this field
});

export default mongoose.models.User || mongoose.model('User', userSchema);