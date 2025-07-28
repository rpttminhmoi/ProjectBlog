require('dotenv').config();
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const postRoutesv1 = require('./routes/v1/post.routes.js');
const postRoutesv2 = require('./routes/v2/post.routes.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Gắn routes vào prefix API
app.use('/api/v1/posts', postRoutesv1);
app.use('/api/v2/posts', postRoutesv2);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
console.log("Loaded post routes");
