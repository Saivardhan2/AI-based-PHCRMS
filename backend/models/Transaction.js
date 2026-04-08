const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true
  },
  residueDetails: {
    cropType: { type: String, required: true },
    totalResidue: { type: Number, required: true },
    residueTypes: [{
      type: { type: String },
      quantity: { type: Number }
    }]
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  environmentalImpact: {
    co2Reduction: { type: Number },
    pm25Reduction: { type: Number },
    treesSaved: { type: Number }
  },
  negotiation: [{
    message: { type: String },
    sender: { type: String, enum: ['farmer', 'buyer'] },
    timestamp: { type: Date, default: Date.now }
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

transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
