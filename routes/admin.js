import express from 'express';

const router = express.Router();

import { getSummary, getOrders, deliverOrder } from '../controllers/admin.js';
import { requireSignin, requireAdmin } from '../middlewares/checkAuth.js';

router.get('/summary', requireSignin, requireAdmin, getSummary);
router.get('/orders', requireSignin, requireAdmin, getOrders);
router.put('/orders/:id/deliver', requireSignin, requireAdmin, deliverOrder);

export default router;
