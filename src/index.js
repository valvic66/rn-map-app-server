require('dotenv').config();
require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);  
app.use(trackRoutes);

mongoose.connect(process.env.DB_MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance!');
});
mongoose.connection.on('error', (error) => {
  console.error(`Connection error: ${error}`);
});

app.get('/', requireAuth, (req, res) => {
  res.send(req.user.email);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});