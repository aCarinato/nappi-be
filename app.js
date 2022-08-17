import express from 'express';
import 'dotenv/config';

import connectDB from './config/db.js';
import products from './routes/products.js';
import auth from './routes/auth.js';
import order from './routes/order.js';
import stripe from './routes/stripe.js';
import admin from './routes/admin.js';

import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// dotenv.config()

connectDB();

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );

  next();
});

app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/order', order);
app.use('/api/stripe', stripe);
app.use('/api/admin', admin);

// If we get till these middlewares (which access req, res), it means the previous routes gave some error
app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
