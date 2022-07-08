import express from 'express';

const router = express.Router();

import {
  getProducts,
  getProductById,
  getProductBySlugEN,
  getProductBySlugIT,
  getProductBySlugDE,
} from '../controllers/products.js';

router.get('/', getProducts);

router.get('/:id', getProductById);

router.get('/slug/en/:slugEN', getProductBySlugEN);

router.get('/slug/it/:slugIT', getProductBySlugIT);

router.get('/slug/de/:slugDE', getProductBySlugDE);

export default router;
