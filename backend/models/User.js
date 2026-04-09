const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  aesthetic_style: {
    type: String,
    enum: ['Minimalistic', 'Modern', 'Industrial', 'Maximalistic', 'Traditional', 'Vintage / Art Deco', 'Cottagecore'],
    default: null
  },
  mood_feel: {
    type: String,
    enum: ['Cosy & Inviting', 'Sleek & Modern', 'Serene & Calm', 'Rustic & Warm', 'Luxurious & Opulent', 'Natural & Organic'],
    default: null
  },
  budget: {
    type: String,
    enum: ['Budget', 'Standard', 'Premium', 'Luxury'],
    default: null
  },
  project: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
