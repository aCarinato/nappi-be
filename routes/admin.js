import express from 'express';

const router = express.Router();

import { getSummary } from '../controllers/admin.js';

router.get('/summary', getSummary);

export default router;
