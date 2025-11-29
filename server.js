require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store io instance in app for access in routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Infinity Mobile Order Management API is running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Join room based on user role
  socket.on('joinRoom', (role) => {
    socket.join(role);
    console.log(`Socket ${socket.id} joined room: ${role}`);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize superadmin if not exists
const initializeSuperadmin = async () => {
  try {
    const superadminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superadminExists) {
      await User.create({
        name: process.env.SUPERADMIN_NAME || 'Super Administrator',
        username: process.env.SUPERADMIN_USERNAME || 'superadmin',
        password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123',
        role: 'superadmin'
      });
      console.log('Superadmin created successfully');
    }
  } catch (error) {
    console.error('Error initializing superadmin:', error);
  }
};

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeSuperadmin();
});
