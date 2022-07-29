import express from 'express';

const router = express.Router();

import { placeOrder, getOrder } from '../controllers/order.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/place-order', requireSignin, placeOrder);
router.get('/:id', requireSignin, getOrder);

export default router;
