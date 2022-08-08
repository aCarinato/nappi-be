import express from 'express';

const router = express.Router();

import {
  placeOrder,
  getOrder,
  getOrderHistory,
  payOrder,
  //   getAccazzo,
} from '../controllers/order.js';
import { requireSignin } from '../middlewares/checkAuth.js';

// router.get('/accazzo', getAccazzo);
router.get('/order-history', requireSignin, getOrderHistory);
router.post('/place-order', requireSignin, placeOrder);
router.get('/:id', requireSignin, getOrder);

router.put('/:id/pay', requireSignin, payOrder);

export default router;
