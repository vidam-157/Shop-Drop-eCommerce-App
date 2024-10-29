import express from "express";
import { placeOrderCOD, placeOrderStripe, verifyStripePayment, placeOrderPayPal, verifyPayPalPayment, allUserOrders, usersOrders, updateOrderStaus } from '../controllers/orderController.js';
import userAuthentication from "../middleware/userAuthentication.js";
import adminAuthentication from "../middleware/adminAuthentication.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list' , adminAuthentication, allUserOrders);
orderRouter.post('/status', adminAuthentication, updateOrderStaus);

// Payemnt Features
orderRouter.post('/place/cash', userAuthentication, placeOrderCOD);
orderRouter.post('/place/stripe', userAuthentication, placeOrderStripe);
orderRouter.post('/place/paypal', userAuthentication, placeOrderPayPal);

// User features
orderRouter.post('/userorders', userAuthentication, usersOrders);

// verify the payment status
orderRouter.post('/verifyStripe', userAuthentication, verifyStripePayment);
orderRouter.post('/verifyPayPal', userAuthentication, verifyPayPalPayment);

export default orderRouter;