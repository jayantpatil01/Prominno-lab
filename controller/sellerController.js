import bcrypt from 'bcrypt';
import User from '../model/UserModel.js';

export const createSeller = async (req, res) => {
    try {
        const { name, email, password, mobileNo, country, state, skills } = req.body || {};

        if (!name || !email || !password || !mobileNo || !country || !state || !skills) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide all the required details to create your seller account." 
            });
        }

        const emailInUse = await User.findOne({ email });
        if (emailInUse) {
            return res.status(400).json({ 
                success: false, 
                message: "This email is already registered with us. Please try logging in or use a different email." 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);

        const newSellerAccount = new User({
            name,
            email,
            password: securedPassword,
            mobileNo,
            country,
            state,
            skills 
        });

        await newSellerAccount.save();

        return res.status(201).json({
            success: true,
            message: `Welcome aboard, ${name}! Your seller account is ready.`,
            seller: {
                id: newSellerAccount._id,
                name: newSellerAccount.name,
                email: newSellerAccount.email
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "We're having trouble creating your account right now. Please try again in a moment.", 
            error: error.message 
        });
    }
};