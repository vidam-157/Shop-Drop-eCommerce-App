import express from "express";
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js';
import userAuthentication from "../middleware/userAuthentication.js";

const cartRouter = express.Router();

cartRouter.get('/get', userAuthentication, getUserCart);
cartRouter.post('/add', userAuthentication, addToCart);
cartRouter.post('/update', userAuthentication, updateCart);

export default cartRouter;