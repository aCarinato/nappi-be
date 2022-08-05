import express from 'express';

const router = express.Router();

import { requireSignin } from '../middlewares/checkAuth.js';
import { createPaymentIntent } from '../controllers/stripe.js';

// router.get('/current-user', requireSignin, currentUser);
router.post('/create-payment-intent', requireSignin, createPaymentIntent);

export default router;
