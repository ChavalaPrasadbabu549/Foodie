const Products = require('../Models/Products');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});

const ProductsController = {
    // Create a new product
    async createProduct(req, res) {
        try {
            const { productName, Description, price, category, stockQuantity, status } = req.body;

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Image upload is required' });
            }

            const newProduct = new Products({
                productName,
                Description,
                image: req.file.filename ? req.file.filename : null,
                price,
                category,
                stockQuantity,
                status
            });

            await newProduct.save();
            return res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Products']
      #swagger.autoBody = false
      #swagger.consumes = ['multipart/form-data']
      #swagger.parameters['image'] = { in: 'formData', type: 'file', required: true, accept: 'image/jpeg, image/png'}
      #swagger.parameters['productName'] = { in: 'formData', type: 'string', required: true }
      #swagger.parameters['Description'] = { in: 'formData', type: 'string', required: true }
      #swagger.parameters['price'] = { in: 'formData', type: 'string', required: true }
      #swagger.parameters['category'] = { in: 'formData', type: 'string', required: true ,enum: ['Bakery','Sweeteners','Foods'],default : 'Bakery'}
      #swagger.parameters['status'] = { in: 'formData', type: 'string', required: true ,enum: ['true','false'],default : 'true'}
      #swagger.parameters['stockQuantity'] = { in: 'formData', type: 'string', required: true}
      */
    },

    // Retrieve all products
    async getProducts(req, res) {
        try {
            const products = await Products.find();
            return res.status(200).json({ success: true, data: products });
        } catch (error) {
            console.log(error);

            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Products']
      */
    },

    // Retrieve a specific product by ID
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Products.findById(id);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return res.status(200).json({ success: true, data: product });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Products']
      */
    },

    // Update a product
    async updateProduct(req, res) {
        try {
            const { id } = req.body;
            const { productName, Description, price, category, stockQuantity, status } = req.body;

            // Find the product by ID
            const product = await Products.findById(id);

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            // Update fields
            if (productName) product.productName = productName;
            if (Description) product.Description = Description;
            if (price) product.price = price;
            if (category) product.category = category;
            if (stockQuantity) product.stockQuantity = stockQuantity;
            if (status) product.status = status;

            // Update image if a new one is uploaded
            if (req.file) {
                product.image = req.file.filename;
            }

            // Save updated product
            await product.save();

            return res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
 #swagger.tags = ['Products']
 #swagger.autoBody = false
 #swagger.consumes = ['multipart/form-data']
 #swagger.parameters['image'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'}
 #swagger.parameters['productName'] = { in: 'formData', type: 'string', required: false }
 #swagger.parameters['Description'] = { in: 'formData', type: 'string', required: false }
 #swagger.parameters['price'] = { in: 'formData', type: 'string', required: false }
 #swagger.parameters['category'] = { in: 'formData', type: 'string', required: false ,enum: ['Bakery','Sweeteners','Foods'],default : 'Bakery'}
 #swagger.parameters['status'] = { in: 'formData', type: 'string', required: false ,enum: ['true','false'],default : 'true'}
 #swagger.parameters['stockQuantity'] = { in: 'formData', type: 'string', required: false}
 #swagger.parameters['id'] = { in: 'formData', type: 'string', required: false }
 */
    },

    //Delete an product
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deleteProduct = await Products.findByIdAndDelete(id);

            if (!deleteProduct) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return res.status(200).json({ success: true, message: 'Product deleted successfully' });

        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Products']
      */

    },

    // Change product status
    async changeProductStatus(req, res) {
        try {
            const { id } = req.query;

            const product = await Products.findById(id)

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            product.status = !product.status;
            await product.save();

            return res.status(200).json({ success: true, message: 'Product status updated successfully', data: product });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
      #swagger.tags = ['Products']
      */

    },

};

module.exports = {
    createProduct: ProductsController.createProduct,
    getProducts: ProductsController.getProducts,
    getProductById: ProductsController.getProductById,
    updateProduct: ProductsController.updateProduct,
    deleteProduct: ProductsController.deleteProduct,
    changeProductStatus: ProductsController.changeProductStatus,
    upload,
};
