import express from 'express';
import { addProduct , getMyProducts , viewProductDetails , deleteProduct} from '../controller/productController.js';
import { isLogin , authorize} from '../middleware/authMiddleware.js'
const router = express.Router();
  
router.post('/add-product', isLogin, authorize('seller'), addProduct);

router.get('/my-products', isLogin, authorize('seller'), getMyProducts);

router.get('/view-pdf/:id', isLogin, authorize('seller'), viewProductDetails);
router.delete('/delete-product/:id', isLogin, authorize('seller'), deleteProduct);

export default router;