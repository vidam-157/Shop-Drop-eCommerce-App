import jwt from 'jsonwebtoken';

const userAuthentication = async (req, res, next) => {

    const { token } = req.headers; // get the token from the headers

    if (!token) {
        return res.json({ success: false, message: 'Authorization failed, Login again' });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET); // verify the token
        req.body.userId = token_decode.id; // add the user id to the request body
        next(); // allow access to the next middleware or route handler
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export default userAuthentication;