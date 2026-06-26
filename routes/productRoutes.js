import express from 'express';
import { upload,getProducts, createProduct} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts); // ✅ for frontend GET
router.post('/',  upload.array('images', 5), createProduct); // ✅ for product creation

export default router;
