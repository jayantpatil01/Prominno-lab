import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {connectDB} from './config/Dbconn.js'

dotenv.config();
//Routes
import authRoutes from './route/authRoute.js'
import sellerRoutes from './route/sellerRoute.js'
import productRoutes from './route/productRoute.js'

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes); 
app.use('/api/seller', sellerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
}
);