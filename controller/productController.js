import Product from '../model/ProductModel.js';
import Brand from '../model/BrandModel.js';


export const addProduct = async (req, res) => {
    try {
        const { productName, productDescription, brands } = req.body || {};

        if (!productName || !productDescription || !brands || !Array.isArray(brands) || brands.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide product name, description, and at least one brand."
            });
        }

        const newProduct = new Product({
            productName,
            productDescription,
            sellerId: req.user.id
        });

        const savedProduct = await newProduct.save();

        const brandsWithProductId = brands.map((item) => ({
            productId: savedProduct._id,
            brandName: item.brandName,
            detail: item.detail,
            image: item.image,
            price: item.price
        }));

        const savedBrands = await Brand.insertMany(brandsWithProductId);

        return res.status(201).json({
            success: true,
            message: "Success! Product and its brands are now live.",
            data: {
                product: savedProduct,
                brands: savedBrands
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong on our end.",
            error: error.message
        });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const page = req.query.page || 1;

        const products = await Product.find({ sellerId: req.user.id })
            .skip((page - 1) * 10) 
            .limit(10);

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ message: "Error loading products" });
    }
};

export const viewProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, sellerId: req.user.id });

        if (!product) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this product."
            });
        }

        const brands = await Brand.find({ productId: id });

        let total = 0;
        for (let i = 0; i < brands.length; i++) {
            total += brands[i].price;
        }

        res.json({
            productName: product.productName,
            description: product.productDescription,
            brands: brands,
            totalPrice: total
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving product details." });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, sellerId: req.user.id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unauthorized."
            });
        }

        await Brand.deleteMany({ productId: id });
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "The product and all related brands have been removed."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Deletion failed due to a server error."
        });
    }
};