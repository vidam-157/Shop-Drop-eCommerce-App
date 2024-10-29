import express from "express";
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/productController.js';
import upload from "../middleware/multer.js";
import adminAuthentication from "../middleware/adminAuthentication.js";

const productRouter = express.Router();

productRouter.post('/add', adminAuthentication, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.get('/list', listProduct);
productRouter.post('/remove', adminAuthentication, removeProduct);
productRouter.get('/single', singleProduct);

export default productRouter;