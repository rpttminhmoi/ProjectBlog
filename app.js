require('dotenv').config();
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const postRoutesv1 = require('./routes/v1/post.routes.js');
const postRoutesv2 = require('./routes/v2/post.routes.js');
const authRoutes = require('./routes/v1/auth.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutesv1);
app.use('/api/v2/posts', postRoutesv2);

// Error Handler
app.use(errorHandler);

module.exports = app;
