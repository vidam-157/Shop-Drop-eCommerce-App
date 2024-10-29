import userModel from '../models/userModel.js';

//  add product to user cart
const addToCart = async (req, res) => {
    try {
        // userId is taken from the token decode and itemId and size are taken from the request body
        const { userId, itemId, size } = req.body; // get the user id, item id and size from the request body
        
        const userData = await userModel.findById(userId); // find the user by the user id
        const cartData = await userData.cartData; // get the cart data of the user

        if (cartData[itemId]) { // check if the item is already in the cart
            if (cartData[itemId][size]) { // check if the size is already in the cart
                cartData[itemId][size] += 1; // increase the quantity of the item
            }
            else {
                cartData[itemId][size] = 1; // add the size to the cart
            }
        }
        else {
            cartData[itemId] = {}; // if the cart is empty, add the item to the cart
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData }); // update the cart of the user
        res.json({ success: true, message: 'Item added to cart' });

    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update the cart of the user
const updateCart = async (req, res) => {
    try {
        // when calling the API we just need to call the itemID, size and quantity only as the userId is automatically from the middleware
        const { userId, itemId, size, quantity } = req.body;
        
        const userData = await userModel.findById(userId); // find the user by the user id
        const cartData = await userData.cartData; // get the cart data of the user

        cartData[itemId][size] = quantity; // update the quantity of the item

        await userModel.findByIdAndUpdate(userId, { cartData }); // update the cart of the user
        res.json({ success: true, message: 'Cart updated' });
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// get user cart data
const getUserCart = async (req, res) => {

    try {

        const { userId } = req.body; // get the user id from the request body

        const userData = await userModel.findById(userId); // find the user by the user id
        const cartData = await userData.cartData; // get the cart data of the user

        res.json({ success: true,  cartData }); // send the cart data to the client
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
    
}

export { addToCart, updateCart, getUserCart };