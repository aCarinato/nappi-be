import express from 'express';

const router = express.Router();

import { placeOrder } from '../controllers/order.js';
import { requireSignin } from '../middlewares/checkAuth.js';

router.post('/place-order', requireSignin, placeOrder);

export default router;
