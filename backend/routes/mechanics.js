const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, authorize } = require('../middleware/auth');
const { haversineDistance, estimateArrivalMinutes, getPriceForService } = require('../utils/helpers');

const router = express.Router();

router.use(protect);

router.get('/nearby', authorize('user'), async (req, res) => {
  try {
    const { lng, lat, serviceType } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ message: 'Location coordinates required' });
    }
    const longitude = parseFloat(lng);
    const latitude = parseFloat(lat);

    const mechanics = await User.find({
      role: 'mechanic',
      isVerified: true,
      isAvailable: true,
    });

    const nearby = mechanics
      .map((m) => {
        const [mLng, mLat] = m.location.coordinates;
        const distance = haversineDistance(latitude, longitude, mLat, mLng);
        const price = serviceType ? getPriceForService(m, serviceType) : null;
        return {
          _id: m._id,
          name: m.name,
          businessName: m.profile?.businessName,
          rating: m.profile?.rating || 0,
          totalRatings: m.profile?.totalRatings || 0,
          totalJobs: m.profile?.totalJobs || 0,
          distance: Math.round(distance * 10) / 10,
          estimatedArrivalMinutes: estimateArrivalMinutes(distance),
          pricing: price,
          services: m.profile?.services || [],
          location: m.location,
        };
      })
      .filter((m) => m.distance <= 50)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/requests', authorize('mechanic'), async (req, res) => {
  try {
    const pending = await ServiceRequest.find({ status: 'pending' })
      .populate('userId', 'name phone')
      .populate('vehicleId')
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/jobs', authorize('mechanic'), async (req, res) => {
  try {
    const jobs = await ServiceRequest.find({ mechanicId: req.user._id })
      .populate('userId', 'name phone')
      .populate('vehicleId')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', authorize('mechanic'), async (req, res) => {
  try {
    const { businessName, bio, experience, services, pricing, isAvailable, location } = req.body;
    const updates = {};
    if (businessName !== undefined) updates['profile.businessName'] = businessName;
    if (bio !== undefined) updates['profile.bio'] = bio;
    if (experience !== undefined) updates['profile.experience'] = experience;
    if (services !== undefined) updates['profile.services'] = services;
    if (pricing !== undefined) updates['profile.pricing'] = pricing;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (location) updates.location = location;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/location', authorize('mechanic'), async (req, res) => {
  try {
    const { coordinates, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location: { type: 'Point', coordinates, address } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/earnings', authorize('mechanic'), async (req, res) => {
  try {
    const completed = await ServiceRequest.find({
      mechanicId: req.user._id,
      status: 'completed',
    });
    const totalEarnings = completed.reduce((sum, j) => sum + (j.finalPrice || j.estimatedPrice), 0);
    res.json({
      totalEarnings,
      totalJobs: completed.length,
      recentJobs: completed.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
