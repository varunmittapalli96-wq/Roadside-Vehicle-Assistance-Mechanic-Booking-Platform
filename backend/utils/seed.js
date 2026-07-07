require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const ServiceRequest = require('../models/ServiceRequest');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://varunmittapalli2005_db_user:nYHH9Kt0RXtj6zAV@cluster0.tmhyjqq.mongodb.net/?appName=Cluster0');
};

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    ServiceRequest.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@roadside.com',
    phone: '9876543210',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  });

  const user = await User.create({
    name: 'John Driver',
    email: 'user@roadside.com',
    phone: '9876543211',
    password: 'user123',
    role: 'user',
    isVerified: true,
    location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'MG Road, Bangalore' },
  });

  const mechanics = await User.insertMany([
    {
      name: 'Rajesh Kumar',
      email: 'rajesh@roadside.com',
      phone: '9876543212',
      password: 'mech123',
      role: 'mechanic',
      isVerified: true,
      isAvailable: true,
      profile: {
        businessName: 'Quick Fix Auto',
        licenseNumber: 'MECH-2024-001',
        experience: 8,
        bio: 'Expert in breakdown repairs and battery services',
        services: ['breakdown_repair', 'battery_jump_start', 'flat_tire_repair'],
        rating: 4.8,
        totalRatings: 156,
        totalJobs: 200,
      },
      location: { type: 'Point', coordinates: [77.6100, 12.9800], address: 'Indiranagar, Bangalore' },
    },
    {
      name: 'Suresh Towing',
      email: 'suresh@roadside.com',
      phone: '9876543213',
      password: 'mech123',
      role: 'mechanic',
      isVerified: true,
      isAvailable: true,
      profile: {
        businessName: 'Highway Tow Services',
        licenseNumber: 'TOW-2024-002',
        experience: 12,
        bio: 'Professional towing and roadside assistance',
        services: ['towing', 'breakdown_repair', 'fuel_delivery'],
        rating: 4.6,
        totalRatings: 89,
        totalJobs: 120,
      },
      location: { type: 'Point', coordinates: [77.5800, 12.9600], address: 'Koramangala, Bangalore' },
    },
    {
      name: 'Amit Sharma',
      email: 'amit@roadside.com',
      phone: '9876543214',
      password: 'mech123',
      role: 'mechanic',
      isVerified: false,
      isAvailable: true,
      profile: {
        businessName: 'City Auto Care',
        licenseNumber: 'MECH-2024-003',
        experience: 3,
        bio: 'New mechanic awaiting verification',
        services: ['flat_tire_repair', 'fuel_delivery'],
      },
      location: { type: 'Point', coordinates: [77.6200, 12.9900], address: 'Whitefield, Bangalore' },
    },
  ]);

  const vehicle = await Vehicle.create({
    userId: user._id,
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    licensePlate: 'KA-01-AB-1234',
    color: 'White',
    fuelType: 'petrol',
  });

  console.log('Seed data created successfully!');
  console.log('\n--- Demo Accounts ---');
  console.log('Admin:    admin@roadside.com / admin123');
  console.log('User:     user@roadside.com / user123');
  console.log('Mechanic: rajesh@roadside.com / mech123');
  console.log('Mechanic: suresh@roadside.com / mech123');
  console.log('Pending:  amit@roadside.com / mech123 (unverified)');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
