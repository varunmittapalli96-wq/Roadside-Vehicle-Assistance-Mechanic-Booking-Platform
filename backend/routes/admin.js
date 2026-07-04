const express = require('express');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', async (_req, res) => {
  try {
    const [totalUsers, totalMechanics, pendingMechanics, activeRequests, completedRequests] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'mechanic', isVerified: true }),
        User.countDocuments({ role: 'mechanic', isVerified: false }),
        ServiceRequest.countDocuments({
          status: { $in: ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'] },
        }),
        ServiceRequest.countDocuments({ status: 'completed' }),
      ]);

    const recentRequests = await ServiceRequest.find()
      .populate('userId', 'name')
      .populate('mechanicId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const avgRating = await ServiceRequest.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);

    const acceptanceRate = await ServiceRequest.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          accepted: {
            $sum: {
              $cond: [{ $ne: ['$status', 'pending'] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalMechanics,
        pendingMechanics,
        activeRequests,
        completedRequests,
        avgRating: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0,
        acceptanceRate: acceptanceRate[0]
          ? Math.round((acceptanceRate[0].accepted / acceptanceRate[0].total) * 100)
          : 0,
      },
      recentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mechanics/pending', async (_req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic', isVerified: false });
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mechanics/:id/verify', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Mechanic not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mechanics/:id/reject', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mechanic application rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/requests', async (_req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('userId', 'name phone')
      .populate('mechanicId', 'name')
      .populate('vehicleId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/requests/:id/resolve', async (req, res) => {
  try {
    const { status, note } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: status || 'cancelled',
        $push: { statusHistory: { status: status || 'cancelled', note: note || 'Resolved by admin' } },
      },
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
