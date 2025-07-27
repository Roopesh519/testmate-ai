import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  togetherApiKey: {
    type: String,
    default: null // Encrypted API key
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;