const express = require('express');
const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/auth');
const { SERVICE_TYPES } = require('../models/ServiceRequest');
const { getPriceForService, estimateArrivalMinutes, haversineDistance } = require('../utils/helpers');

const router = express.Router();

router.use(protect);

router.get('/types', (_req, res) => {
  res.json(SERVICE_TYPES);
});

router.post('/', authorize('user'), async (req, res) => {
  try {
    const { vehicleId, serviceType, description, location, mechanicId } = req.body;
    if (!vehicleId || !serviceType || !location?.coordinates) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const vehicle = await Vehicle.findOne({ _id: vehicleId, userId: req.user._id });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    let estimatedPrice = 500;
    let estimatedArrivalMinutes = 20;

    if (mechanicId) {
      const mechanic = await User.findById(mechanicId);
      if (mechanic) {
        estimatedPrice = getPriceForService(mechanic, serviceType);
        const [mLng, mLat] = mechanic.location.coordinates;
        const [uLng, uLat] = location.coordinates;
        const dist = haversineDistance(uLat, uLng, mLat, mLng);
        estimatedArrivalMinutes = estimateArrivalMinutes(dist);
      }
    }

    const request = await ServiceRequest.create({
      userId: req.user._id,
      vehicleId,
      serviceType,
      description,
      location,
      mechanicId: mechanicId || undefined,
      estimatedPrice,
      estimatedArrivalMinutes,
      statusHistory: [{ status: 'pending', note: 'Request submitted' }],
    });

    const populated = await request.populate(['vehicleId', 'mechanicId']);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'user') filter.userId = req.user._id;
    else if (req.user.role === 'mechanic') filter.mechanicId = req.user._id;

    const requests = await ServiceRequest.find(filter)
      .populate('userId', 'name phone')
      .populate('vehicleId')
      .populate('mechanicId', 'name phone profile')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('userId', 'name phone')
      .populate('vehicleId')
      .populate('mechanicId', 'name phone profile location');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/accept', authorize('mechanic'), async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer available' });
    }
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Account not verified yet' });
    }

    request.mechanicId = req.user._id;
    request.status = 'accepted';
    request.estimatedPrice = getPriceForService(req.user, request.serviceType);
    request.mechanicLocation = req.user.location;
    request.statusHistory.push({ status: 'accepted', note: 'Mechanic accepted request' });
    await request.save();

    const populated = await request.populate(['userId', 'vehicleId', 'mechanicId']);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, note, mechanicLocation } = req.body;
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner = request.userId.toString() === req.user._id.toString();
    const isMechanic = request.mechanicId?.toString() === req.user._id.toString();
    if (!isOwner && !isMechanic && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'cancelled' && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only user can cancel' });
    }

    request.status = status;
    if (mechanicLocation) request.mechanicLocation = mechanicLocation;
    if (status === 'completed' && req.body.finalPrice) {
      request.finalPrice = req.body.finalPrice;
    }
    request.statusHistory.push({ status, note: note || '' });
    await request.save();

    if (status === 'completed' && request.mechanicId) {
      await User.findByIdAndUpdate(request.mechanicId, {
        $inc: {
          'profile.totalJobs': 1,
          'profile.earnings': request.finalPrice || request.estimatedPrice,
        },
      });
    }

    const populated = await request.populate(['userId', 'vehicleId', 'mechanicId']);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/rate', authorize('user'), async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const request = await ServiceRequest.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'completed',
    });
    if (!request) return res.status(404).json({ message: 'Completed request not found' });

    request.rating = rating;
    request.feedback = feedback;
    await request.save();

    if (request.mechanicId && rating) {
      const mechanic = await User.findById(request.mechanicId);
      const total = mechanic.profile.totalRatings || 0;
      const current = mechanic.profile.rating || 0;
      const newTotal = total + 1;
      const newRating = (current * total + rating) / newTotal;
      await User.findByIdAndUpdate(request.mechanicId, {
        'profile.rating': Math.round(newRating * 10) / 10,
        'profile.totalRatings': newTotal,
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
