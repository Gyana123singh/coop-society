const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const User = require('./models/User');
const Vendor = require('./models/Vendor');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.set('trust proxy', 1);

// 1. Database Connection & Seed Data Execution
connectDB().then(async () => {
  try {
    // A. Seed Super Admin Account Only (if not already existing)
    let superAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Administrator',
        email: config.initialSuperAdmin.email,
        password: config.initialSuperAdmin.password,
        role: 'SUPER_ADMIN'
      });
      console.log(`[Seed] Super Admin created: ${config.initialSuperAdmin.email}`);
    }

    // B. Initial Housing Society Seed (ONLY IF NO VENDORS EXIST IN MONGO DB)
    const vendorCount = await Vendor.countDocuments();
    if (vendorCount === 0) {
      const initialVendor = await Vendor.create({
        name: 'Mandovi Nagar Co-Op. Housing Society Ltd.,',
        address: 'Porvorim, Alto Porvorim, Goa 403521',
        regNo: 'HSG-(a)-70/GOA',
        panNo: 'AAAAA0000A',
        gstNo: '30AAAAA0000A1Z5',
        bankName: 'State Bank of India',
        accountName: 'Mandovi Nagar Co-Op. Housing Society Ltd.',
        accountNo: '38492019482',
        ifscCode: 'SBIN0001234',
        branchName: 'Panaji Branch',
        upiId: 'mandovi.society@sbi',
        status: 'ACTIVE'
      });

      await User.create({
        name: 'Mandovi Nagar Secretary',
        email: 'secretary@mandovinagar.org',
        password: 'SecretaryPassword123!',
        role: 'SECRETARY',
        vendorId: initialVendor._id
      });
      console.log(`[Seed] Initial Housing Society created: ${initialVendor.name}`);
    }
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
});

// 2. Security & Global Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: '*', // Allows Flutter mobile & web clients
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-vendor-id', 'Cache-Control', 'Pragma', 'Expires']
}));

// Rate limiting (generous limits so dev polling & PDF downloads are never blocked)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10000 : 100000,
  skip: (req) => req.path.includes('/pdf') || req.path.includes('/public-vendors'),
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. API Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'Coop 365 Backend API (Multi-Vendor)',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// 4. Mount API Routes (/api/v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/super-admin', superAdminRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/receipts', receiptRoutes);
app.use('/api/v1/reports', reportRoutes);

// 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// 5. Global Error Handling Middleware
app.use(errorHandler);

// 6. Start Server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`[Coop 365 Server] Running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
});

module.exports = app;
