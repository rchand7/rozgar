import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            // Redirect to the signup page if the user is not authenticated
            return res.redirect('https://rozgar-yyt2.onrender.com'); // You can change the URL if needed
        }
        
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.userId;
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred",
            success: false,
        });
    }
}

export default isAuthenticated;
