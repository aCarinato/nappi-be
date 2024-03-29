import express from 'express';

const router = express.Router();

import { requireSignin, requireAdmin } from '../middlewares/checkAuth.js';
import {
  signup,
  activateAccount,
  login,
  currentUser,
  getUser,
  updateProfile,
} from '../controllers/auth.js';

router.get('/current-user', requireSignin, currentUser);
// router.get('/current-admin', requireSignin, requireAdmin, currentUser);
router.get('/:email', getUser);
router.post('/signup', signup);
router.post('/signup/activate', activateAccount);
router.post('/login', login);
router.put('/update', requireSignin, updateProfile);

export default router;
