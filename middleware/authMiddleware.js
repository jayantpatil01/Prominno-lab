import jwt from 'jsonwebtoken';

export const isLogin = (req, res, next) => {
    try {
        const authToken = req.cookies.token;

        if (!authToken) {
            return res.status(401).json({ 
                success: false, 
                message: "Please log in to access this feature." 
            });
        }
        const verifiedUser = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = verifiedUser; 
        
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: "Your session has expired or is invalid. Please log in again." 
        });
    }
};

export const authorize = (requiredRole) => {
    return (req, res, next) => {
        const hasPermission = req.user && req.user.role === requiredRole;

        if (hasPermission) {
            return next();
        }

        return res.status(403).json({ 
            success: false, 
            message: `Access denied. This section is reserved for ${requiredRole}s only.` 
        });
    };
};