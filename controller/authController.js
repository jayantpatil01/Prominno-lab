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

        // --- COOKIE IMPLEMENTATION ---
        const cookieOptions = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
            httpOnly: true, // Prevents JS access (Protects against XSS)
            secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
            sameSite: "strict", // Prevents CSRF attacks
        };

        return res
            .status(200)
            .cookie("token", authToken, cookieOptions) // Set the cookie here
            .json({
                success: true,
                message: `Hello ${account.name}, glad to see you again!`,
                role: account.role // We still send the role for UI logic
            });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Something went wrong.",
            error: error.message 
        });
    }
};

export const logout = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};