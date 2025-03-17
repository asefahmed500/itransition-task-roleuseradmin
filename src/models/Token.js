import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Token expires in 1 hour
});

export default mongoose.models.Token || mongoose.model('Token', tokenSchema);