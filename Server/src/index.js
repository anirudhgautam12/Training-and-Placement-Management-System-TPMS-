require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const companyRoutes = require('../routes/companies');
const placementRoutes = require('../routes/placements');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/placements', placementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));