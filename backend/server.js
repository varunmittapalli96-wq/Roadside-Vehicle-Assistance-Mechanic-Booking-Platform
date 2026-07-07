require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/mechanics', require('./routes/mechanics'));
app.use('/api/requests', require('./routes/serviceRequests'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Roadside Assistance API' });
});

app.get('/', (_req, res) => {
  res.send('<h1>Roadside Assistance API is running successfully!</h1>');
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
