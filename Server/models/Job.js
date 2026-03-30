const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  description: String,
  location: String,
  salary: String,
  skillsRequired: [String],
  branchEligibility: [String],
  cgpaCriteria: Number,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now },
  deadline: Date,
});

module.exports = mongoose.model('Job', jobSchema);
