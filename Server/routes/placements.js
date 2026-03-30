const express = require('express');
const Placement = require('../models/Placement');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all placements
router.get('/', authMiddleware, async (req, res) => {
  try {
    const placements = await Placement.find().populate('student', 'name email').populate('company', 'name');
    res.json(placements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get placement by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id).populate('student', 'name email').populate('company', 'name');
    if (!placement) return res.status(404).json({ error: 'Placement not found' });
    res.json(placement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create placement
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    res.status(201).json(placement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update placement
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!placement) return res.status(404).json({ error: 'Placement not found' });
    res.json(placement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete placement
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) return res.status(404).json({ error: 'Placement not found' });
    res.json({ message: 'Placement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;