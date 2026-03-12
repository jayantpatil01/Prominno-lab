import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../model/UserModel.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter your email and password." 
            });
        }

        const account = await User.findOne({ email });
        
        if (!account) {
            return res.status(401).json({ 
                success: false, 
                message: "We couldn't find an account with those details." 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, account.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                success: false, 
                message: "The password you entered is incorrect." 
            });
        }

        const authToken = jwt.sign(
            { id: account._id, role: account.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: `Hello ${account.name}, glad to see you again!`,
            token: authToken,
            role: account.role 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Something went wrong on our end. Please try again later.",
            error: error.message 
        });
    }
};