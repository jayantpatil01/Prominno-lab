import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: [true, "Product name is required"],
        trim: true 
    },
    productDescription: { 
        type: String, 
        required: [true, "Description is required"],
        trim: true 
    },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User who created this
        required: true 
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;