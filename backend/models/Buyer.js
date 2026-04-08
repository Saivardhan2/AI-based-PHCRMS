const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  businessType: {
    type: String,
    required: true,
    enum: ['biomass_plant', 'fodder_supplier', 'biochar_producer', 'biogas_plant', 'composting_facility', 'others']
  },
  requiredResidueTypes: [{
    type: String,
    required: true
  }],
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  minimumQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  maximumQuantity: {
    type: Number,
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
  isActive: {
    type: Boolean,
    default: true
  },
  transactions: [{
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    quantity: { type: Number },
    totalPrice: { type: Number },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
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

buyerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Buyer', buyerSchema);
