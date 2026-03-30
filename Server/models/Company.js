const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  industry: String,
  contactEmail: String,
  contactPhone: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Company", companySchema);
