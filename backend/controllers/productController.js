import { v2 as cloudinary } from 'cloudinary';
import ProductModel from '../models/productModel.js';

// Add a product
const addProduct = async (req, res) => {

    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        // Get uploaded images
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((file) => file !== undefined);

        console.log('Images to upload:', images);

        // Upload images to Cloudinary
        let imagesURL = await Promise.all(
            images.map(async (image) => {
                if (image) {
                    try {
                        const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
                        return result.secure_url;
                    } catch (error) {
                        console.error('Error uploading image to Cloudinary:', error);
                        return null;
                    }
                }
                return null; // Return null if no image
            })
        );

        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price), // Convert price to number
            sizes: JSON.parse(sizes), // Convert to array
            bestSeller: bestSeller === 'true', // Convert to boolean
            image: imagesURL,
            date: Date.now(),
        };

        const product = new ProductModel(productData);
        await product.save();

        res.json({ success: true, message: 'Product added successfully' });
    } 
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// List products
const listProduct = async (req, res) => {

    try {
        const products = await ProductModel.find({});
        res.json({ success: true, products });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove products
const removeProduct = async (req, res) => {

    try {
        await ProductModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'Product removed successfully' });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Function to set single product details
const singleProduct = async (req, res) => {

    try {
        const { productId } = req.body;
        const product = await ProductModel.findById(productId);
        res.json({ success: true, product });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

export { addProduct, listProduct, removeProduct, singleProduct };
