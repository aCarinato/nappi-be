import express from 'express';

const router = express.Router();

import { placeOrder, getOrder, payOrder } from '../controllers/order.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/place-order', requireSignin, placeOrder);
router.get('/:id', requireSignin, getOrder);
router.put('/:id/pay', requireSignin, payOrder);

export default router;
