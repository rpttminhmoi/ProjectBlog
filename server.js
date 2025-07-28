require('dotenv').config();
const express = require('express');
const cors = require('cors');

const postRoutes = require('./routes/v1/post.routes');
const postRoutes = require('./routes/v1/post.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Gắn routes vào prefix API
app.use('/api/v1/posts', postRoutes);
app.use('/api/v2/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
console.log("Loaded post routes");
