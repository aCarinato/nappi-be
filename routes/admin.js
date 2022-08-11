import express from 'express';

const router = express.Router();

import { getSummary, getOrders } from '../controllers/admin.js';

router.get('/summary', getSummary);
router.get('/orders', getOrders);

export default router;
