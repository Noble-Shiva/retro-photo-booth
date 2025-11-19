require('dotenv').config();
const express = require('express');
const cors = require('cors');
const photoRoutes = require('./routes/photos');
const groupRoutes = require('./routes/groups');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/photos', photoRoutes);
app.use('/api/groups', groupRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Retro Photo Booth server running on port ${PORT}`);
});
