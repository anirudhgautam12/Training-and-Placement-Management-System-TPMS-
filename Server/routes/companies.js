const express = require('express');
const Company = require('../models/Company');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all companies
router.get('/', authMiddleware, async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create company
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update company
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete company
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;