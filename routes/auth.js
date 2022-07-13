import express from 'express';

const router = express.Router();

import { requireSignin } from '../middlewares/checkAuth.js';
import { signup, login, currentUser, getUser } from '../controllers/auth.js';

router.get('/current-user', requireSignin, currentUser);
router.get('/:email', getUser);
router.post('/signup', signup);
router.post('/login', login);

export default router;
