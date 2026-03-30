const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

// Apply to a job (student)
router.post('/jobs/:jobId/apply', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const existing = await Application.findOne({ student: req.user.id, job: job._id });
    if (existing) {
      return res.status(409).json({ error: 'Already applied for this job' });
    }

    let resumeUrl = req.body.resumeUrl;
    if (req.file) {
      const streamifier = require('streamifier');
      const stream = streamifier.createReadStream(req.file.buffer);
      const result = await new Promise((resolve, reject) => {
        const streamUpload = cloudinary.uploader.upload_stream({ resource_type: 'raw', folder: 'tpms_resumes' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        stream.pipe(streamUpload);
      });
      resumeUrl = result.secure_url;
    }

    const application = new Application({
      student: req.user.id,
      job: job._id,
      resumeUrl,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View own applications (student)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Students only' });
    const applications = await Application.find({ student: req.user.id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin can view all applications
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const applications = await Application.find().populate('student', 'name email phone branch cgpa').populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin update application status
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { status, remarks }, { new: true });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
