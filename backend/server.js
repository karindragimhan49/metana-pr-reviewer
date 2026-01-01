require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const webhookRoutes = require('./src/routes/webhook');

// Middleware
app.use(cors());
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/github`);
});
