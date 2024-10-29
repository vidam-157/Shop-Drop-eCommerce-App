import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// function to create
const createToken = (id) => {
    return jwt.sign( {id}, process.env.JWT_SECRET)
}

// User login route
const userLogin = async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});

        if(!user) {
            return res.json({success:false, message:'User not found'});
        }

        const isMatch = await bycrypt.compare(password, user.password);  // user.password is the hashed password we saved in the database

        if(isMatch) {
           const token = createToken(user._id); // creating the token for the user
           res.json({success:true, token});
        }
        else {
            res.json({success:false, message:'Invalid credentials'});
        }
    } 
    catch (error) {
        res.json({success:false, message:'User login failed'});
    }

};

// User registration route
const userRegister = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        //  Check if the user already exists or not
        const exists = await UserModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Validation for password and email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: 'Password should be at least 8 characters long' });
        }

        // Hash the password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        // Create a new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();  // Save the user to the database

        const token = createToken(user._id);  // Create a token for the user

        res.json({ success: true, user, token });  // Send the user and token as response
    }

    catch (error) {
        res.json({success:false, message:'User registration failed'});
    }

};

// Admin login route
const adminLogin = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Check if the provided credentials match the environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Sign a token with email and password to the admin
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET);

            // Return the generated token in the response
            return res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Admin login failed' });
    }
};

export { userLogin, userRegister, adminLogin };
