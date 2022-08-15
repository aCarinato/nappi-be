import express from 'express';

const router = express.Router();

import { getSummary, getOrders, deliverOrder } from '../controllers/admin.js';

router.get('/summary', getSummary);
router.get('/orders', getOrders);
router.put('/orders/:id/deliver', deliverOrder);

export default router;
