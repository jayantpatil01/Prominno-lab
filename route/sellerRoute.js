import express from 'express';
import { createSeller} from '../controller/sellerController.js';
import { isLogin , authorize} from '../middleware/authMiddleware.js'
const router = express.Router();
  
router.post('/create', isLogin, authorize('admin'), createSeller);


export default router;