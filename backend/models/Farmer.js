const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  cropType: {
    type: String,
    required: true,
    enum: ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'pulses', 'others']
  },
  yield: {
    type: Number,
    required: true,
    min: 0
  },
  cultivatedArea: {
    type: Number,
    required: true,
    min: 0
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  residueEstimations: [{
    date: { type: Date, default: Date.now },
    totalResidue: { type: Number },
    residueTypes: [{
      type: { type: String },
      quantity: { type: Number }
    }],
    utilizationRecommendation: { type: String }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

farmerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Farmer', farmerSchema);
