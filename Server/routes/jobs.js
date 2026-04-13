const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const Company = require('../models/Company');
const { authMiddleware, adminMiddleware, adminOrCompanyMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create job posting (admin or company)
router.post('/', authMiddleware, adminOrCompanyMiddleware, async (req, res) => {
  try {
    const data = { ...req.body, postedBy: req.user.id };
    
    // Dynamically inject the company object reference if role is recruiter
    if (req.user.role === 'company') {
      const user = await User.findById(req.user.id);
      let comp = await Company.findOne({ name: user.name });
      if (!comp) {
        comp = new Company({ name: user.name });
        await comp.save();
      }
      data.company = comp._id;
    }

    const job = new Job(data);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View all job postings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'name location industry');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View one job posting
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name location industry');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
