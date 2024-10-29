import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean, required: true },
    image: { type: Array, required: true },
    date: { type: Date, required: true, default: Date.now }, // Default to current date
});

// Create or reuse the existing Product model
const ProductModel = mongoose.model.Product || mongoose.model("Product", productSchema);

export default ProductModel;
