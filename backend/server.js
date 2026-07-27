const express = require('express');
const cors = require('cors');
require('dotenv').config();
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Centralized Scholar Monitoring System API');
});

app.use('/api/auth', authRoutes);
app.use('/api', applicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});