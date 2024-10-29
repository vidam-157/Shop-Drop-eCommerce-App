import jwt from 'jsonwebtoken';

// admin functionalities are protected by this middleware
const adminAuthentication = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;
        
        // Check if the Authorization header exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Authorization failed, Try again' });
        }

        // Extract the token part (after "Bearer ")
        const token = authHeader.split(' ')[1];

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is valid by comparing decoded information
        const isValid = token_decode.email === process.env.ADMIN_EMAIL && token_decode.password === process.env.ADMIN_PASSWORD;
        if (!isValid) {
            return res.json({ success: false, message: 'Authorization failed, Try again' });
        }

        next();  // If valid, allow access to the next middleware or route handler
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuthentication;
