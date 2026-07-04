const express = require('express');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authorize('user'), async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, userId: req.user._id });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authorize('user'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authorize('user'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
