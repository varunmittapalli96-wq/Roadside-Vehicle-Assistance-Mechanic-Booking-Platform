const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['user', 'mechanic', 'admin'],
      default: 'user',
    },
    isVerified: { type: Boolean, default: false },
    profile: {
      businessName: String,
      licenseNumber: String,
      experience: Number,
      bio: String,
      services: [{ type: String }],
      pricing: {
        breakdownRepair: { type: Number, default: 500 },
        towing: { type: Number, default: 800 },
        batteryJumpStart: { type: Number, default: 300 },
        flatTireRepair: { type: Number, default: 400 },
        fuelDelivery: { type: Number, default: 350 },
      },
      rating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      totalJobs: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [77.5946, 12.9716] },
      address: String,
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, isVerified: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
