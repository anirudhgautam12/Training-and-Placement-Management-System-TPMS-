const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role: { type: String, required: true },
  salary: Number,
  placementDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['offered', 'accepted', 'rejected'], default: 'offered' }
});

module.exports = mongoose.model('Placement', placementSchema);