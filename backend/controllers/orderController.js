import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import paypal from "paypal-rest-sdk";

// Global variables
const currency = 'USD';
const deliveryCharge = 10;

// Gateway initializing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

paypal.configure({
    mode: process.env.PAYPAL_MODE || 'sandbox', // or 'live' for production
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET_KEY,
  });

// ------------------------------------ CASH ON DELIVARY ------------------------------------------------
// Placing orders using COD
const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData); // create a new order document
        await newOrder.save(); // save the order to the database

        await userModel.findByIdAndUpdate(userId, { cartData: {cartData:{}} }); // empty the cart of the user after the order is placed

        res.json({ success: true, message: 'Order placed successfully' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// ------------------------------------ STRIPEPAY --------------------------------------------------------

// Place orders using Stripe pay
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
        }

        const newOrder = new orderModel(orderData); // create a new order document
        await newOrder.save(); // save the order to the database

        const line_items = items.map((item) => ({
            price_data: {
                currency : currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency : currency,
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        // create a session for the payment
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });
        res.json({ success: true, session_url: session.url }); 
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Stripe payment
const verifyStripePayment = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true }); // update the payment status in the database
            await userModel.findByIdAndUpdate(userId, { cartData: { cartItems: {} } }); // empty the cart of the user after the order is placed
            res.json({ success: true, message: 'Payment successful' });
        }
        else {
            await orderModel.findByIdAndDelete(orderId); // delete the order if the payment fails
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// ------------------------------------ PAYPAL ------------------------------------------------------
// Place orders using PayPal
const placeOrderPayPal = async (req, res) => {

    console.log("pay pal accessed")
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'PayPal', // Update to PayPal
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Prepare PayPal payment details
        const paymentData = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: `${req.headers.origin}/verify?success=true&orderId=${newOrder._id}`, // Update return URL
                cancel_url: `${req.headers.origin}/verify?success=false&orderId=${newOrder._id}`, // Update cancel URL
            },
            transactions: [
                {
                    amount: {
                        currency: currency,
                        total: (amount + deliveryCharge).toFixed(2), // Total amount including delivery
                    },
                    description: "Order from your site",
                },
            ],
        };

        // Create PayPal payment
        paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
                console.log("Error creating PayPal payment:", error);
                return res.status(500).json({ success: false, message: error.message });
            }

            // Find the approval URL to redirect the user to PayPal
            const approvalUrl = payment.links.find(link => link.rel === "approval_url").href;
            res.json({ success: true, session_url: approvalUrl }); // Send approval URL for frontend redirection
        });
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const verifyPayPalPayment = async (req, res) => {
    const { orderId, success, userId } = req.query; // Use req.query for query parameters
    try {
        if (success === "true") {

            // Assuming the payment is valid
            await orderModel.findByIdAndUpdate(orderId, { payment: true }); // update the payment status in the database
            await userModel.findByIdAndUpdate(userId, { cartData: { cartItems: {} } }); // empty the cart of the user after the order is placed
            
            res.json({ success: true, message: 'Payment successful' });
        } else {
            await orderModel.findByIdAndDelete(orderId); // delete the order if the payment fails
            res.json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List all the orders data in the orders section of the admin panel
const allUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}); // get all the orders from the database
        res.json({ success: true, orders });
    }
    catch(error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User orders data for the frontend
const usersOrders = async (req, res) => {
    try {
        const { userId } = req.body; // get the user id from the request body

        const orders = await orderModel.find({ userId }); // get all the orders of the user

        res.json({ success: true, orders });
    }
    catch(error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update the order status
const updateOrderStaus  = async (req, res) => {
    try {
        const { orderId, status } = req.body; // get the order id and status from the request body

        await orderModel.findByIdAndUpdate(orderId, { status }); // update the order status in the database
        res.json({ success: true, message: 'Order status updated' });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrderCOD, placeOrderStripe, verifyStripePayment, placeOrderPayPal, verifyPayPalPayment, allUserOrders, usersOrders, updateOrderStaus };