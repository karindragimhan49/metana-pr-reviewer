require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const webhookRoutes = require('./src/routes/webhook');
const reviewRoutes = require('./src/routes/reviewRoutes');
const gradingRoutes = require('./routes/gradingRoutes');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'GitHub PR Review Tool API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/grade', gradingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/github`);
});
