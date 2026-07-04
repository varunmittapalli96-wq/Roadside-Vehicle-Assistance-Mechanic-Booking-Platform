const mongoose = require('mongoose');

const SERVICE_TYPES = [
  'breakdown_repair',
  'towing',
  'battery_jump_start',
  'flat_tire_repair',
  'fuel_delivery',
];

const STATUS_FLOW = [
  'pending',
  'accepted',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
];

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceType: { type: String, enum: SERVICE_TYPES, required: true },
    description: { type: String, default: '' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      address: { type: String, required: true },
    },
    mechanicLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },
    status: { type: String, enum: STATUS_FLOW, default: 'pending' },
    estimatedPrice: { type: Number, required: true },
    finalPrice: { type: Number },
    estimatedArrivalMinutes: { type: Number },
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

serviceRequestSchema.index({ location: '2dsphere' });
serviceRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports.SERVICE_TYPES = SERVICE_TYPES;
module.exports.STATUS_FLOW = STATUS_FLOW;
