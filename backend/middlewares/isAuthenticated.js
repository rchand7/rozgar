import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        // Ensure cookies exist and extract the token
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please sign up at https://rozgar-yyt2.onrender.com",  // Just a plain URL as text
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false,
            });
        }

        // Attach user ID to the request object
        req.id = decoded.userId;
        next();
    } catch (error) {
        // Handle specific token error cases
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
                success: false,
            });
        }

        // General error handling
        console.error("Authentication Error:", error.message);
        return res.status(500).json({
            message: "An error occurred during authentication.",
            success: false,
        });
    }
};

export default isAuthenticated;
