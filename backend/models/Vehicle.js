const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true },
    color: String,
    fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'], default: 'petrol' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
