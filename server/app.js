const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const reviewsRouter = require('./routes/reviews');
const ordersRouter = require('./routes/orders');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/orders', ordersRouter);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
