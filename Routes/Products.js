const express = require('express');
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    changeProductStatus,
    upload
} = require('../Controllers/ProductsControllers');
const verifyToken = require('../Middleware/VerifyToken'); // Middleware for token authentication
const Authentication = require('../Middleware/Authentication'); //authentication for user
const router = express.Router();

// Public Route
router.post('/createProduct', verifyToken, Authentication, upload.single('image'), createProduct);
router.get('/getproducts', verifyToken, Authentication, getProducts);
router.get('/product/:id', verifyToken, Authentication, getProductById);
router.put('/updateProduct', verifyToken, Authentication, upload.single('image'), updateProduct);
router.delete('/deleteProduct', verifyToken, Authentication, deleteProduct);
router.patch('/changeStatus', verifyToken, Authentication, changeProductStatus);
module.exports = router;
