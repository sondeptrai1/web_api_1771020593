require('dotenv').config();
// Load firebase config (optional)
require('./config/firebase');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/menu-items', require('./routes/menuItemRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Student: Nguyễn Thị Thành Nhã - ID: 1771020519`);
});
