require('dotenv').config();
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const postRoutesv1 = require('./routes/v1/post.routes.js');
const postRoutesv2 = require('./routes/v2/post.routes.js');

const app = express();
const authRoutes = require('./routes/v1/auth.routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

//API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutesv1);
app.use('/api/v2/posts', postRoutesv2);

// Health Check Route
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
console.log("Loaded post routes");
