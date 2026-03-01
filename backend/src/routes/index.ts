// routes/index.ts   (or your main router file)

import { Router } from 'express';
import { upload } from '../config/upload';
import uploadRoutes from './uploadRoutes';

import {
  // Category controllers
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
  // deleteCategoryPermanently,   // optional – uncomment if needed
} from '../controllers/categoryController';

import {
  // Product controllers
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deactivateProduct,
  deleteProductPermanently,
} from '../controllers/productController';

const router = Router();

// ────────────────────────────────────────────────
//                  CATEGORIES
// ────────────────────────────────────────────────

router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deactivateCategory);
// router.delete('/categories/:id/permanent', deleteCategoryPermanently);  // optional

// ────────────────────────────────────────────────
//                    PRODUCTS
// ────────────────────────────────────────────────

router.get('/products', getAllProducts);
router.post('/products', upload.single('image'), createProduct);
router.get('/products/:id', getProductById);
router.patch('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProductPermanently);
// router.delete('/products/:id', deactivateProduct);

// ────────────────────────────────────────────────
//                     UPLOAD
// ────────────────────────────────────────────────

router.use('/upload', uploadRoutes);

export default router;
