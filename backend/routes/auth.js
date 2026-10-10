const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      businessName,
      licenseNumber,
      experience,
      bio,
      services,
      hasTowing,
      towTruckType,
      address,
      towingRate,
      companyName,
      fleetSize,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      licensePlate,
      coordinates,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const userRole = ['user', 'mechanic'].includes(role) ? role : 'user';

    let profileData = undefined;
    if (userRole === 'mechanic') {
      const servicesList = Array.isArray(services) && services.length > 0
        ? [...services]
        : ['breakdown_repair', 'battery_jump_start', 'flat_tire_repair'];

      if (hasTowing && !servicesList.includes('towing')) {
        servicesList.push('towing');
      }

      profileData = {
        businessName: businessName || `${name}'s Workshop & Towing`,
        licenseNumber: licenseNumber || 'MECH-PENDING',
        experience: Number(experience) || 3,
        bio: bio || (hasTowing ? 'Certified mechanic and towing partner ready for 24/7 roadside assistance.' : 'Certified roadside mechanic.'),
        services: servicesList,
        hasTowing: Boolean(hasTowing),
        towTruckType: towTruckType || (hasTowing ? 'Flatbed Tow Truck' : ''),
        pricing: {
          breakdownRepair: 500,
          towing: Number(towingRate) || 800,
          batteryJumpStart: 300,
          flatTireRepair: 400,
          fuelDelivery: 350,
          lockout: 450,
        },
        rating: 0,
        totalRatings: 0,
        totalJobs: 0,
        earnings: 0,
      };
    } else if (role === 'fleet' || companyName) {
      profileData = {
        businessName: companyName || `${name} Fleet Operations`,
        fleetSize: fleetSize || '1-5 Vehicles',
      };
    }

    const coords = Array.isArray(coordinates) && coordinates.length === 2
      ? coordinates
      : [77.5946, 12.9716];

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: userRole,
      isVerified: userRole === 'user',
      profile: profileData,
      location: {
        type: 'Point',
        coordinates: coords,
        address: address || 'Bangalore, India',
      },
    });

    if (userRole === 'user' && vehicleMake && vehicleModel && licensePlate) {
      try {
        await Vehicle.create({
          userId: user._id,
          make: vehicleMake,
          model: vehicleModel,
          year: Number(vehicleYear) || new Date().getFullYear(),
          licensePlate: licensePlate.toUpperCase().trim(),
          fuelType: 'petrol',
        });
      } catch (vErr) {
        console.warn('Auto vehicle creation note:', vErr.message);
      }
    }

    const token = signToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential, email: inputEmail, name: inputName, role } = req.body;
    let email = inputEmail;
    let name = inputName;

    // Decode JWT payload if credential token is provided from Google Identity Services
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.email) {
            email = payload.email;
            name = payload.name || name || payload.email.split('@')[0];
          }
        }
      } catch (decErr) {
        console.warn('Error parsing Google credential payload:', decErr.message);
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Google authentication failed: Email is required' });
    }

    email = email.toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-register new user via Google
      const userRole = ['user', 'mechanic'].includes(role) ? role : 'user';
      const randomPassword = Math.random().toString(36).slice(-8) + 'A1!' + Date.now();

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: '',
        password: randomPassword,
        role: userRole,
        isVerified: userRole === 'user',
        profile: userRole === 'mechanic' ? {
          businessName: `${name || 'Partner'}'s Auto Care & Towing`,
          licenseNumber: 'GOOGLE-VERIFIED',
          experience: 3,
          bio: 'Verified professional mechanic & towing service partner.',
          services: ['breakdown_repair', 'towing', 'battery_jump_start'],
          hasTowing: true,
          towTruckType: 'flatbed',
          pricing: {
            breakdownRepair: 500,
            towing: 800,
            batteryJumpStart: 300,
            flatTireRepair: 400,
            fuelDelivery: 350,
            lockout: 450,
          },
          rating: 5,
          totalRatings: 1,
          totalJobs: 0,
          earnings: 0,
        } : undefined,
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bangalore, India',
        },
      });
    }

    const token = signToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', require('../middleware/auth').protect, (req, res) => {
  res.json(req.user);
});

router.put('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) {
      user.location = {
        type: 'Point',
        coordinates: location.coordinates || [77.5946, 12.9716],
        address: location.address || '',
      };
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
