import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Reference to the Parent Product
        required: true 
    },
    brandName: { 
        type: String, 
        required: true,  
    },
    detail: { 
        type: String, 
        required: true,  
    },
    image: { 
        type: String, 
        required: true, 
    },
    price: { 
        type: Number, 
        required: true, 
    }
}, { timestamps: true });

export const Brand = mongoose.model('Brand', brandSchema);

export default Brand;