import express from 'express';

const router = express.Router();

import { getProducts, getProductById } from '../controllers/products.js';

router.get('/', getProducts);

router.get('/:id', getProductById);

export default router;
