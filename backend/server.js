import express from 'express';
import cors from 'cors';

// dotenv is imported in server.js
import 'dotenv/config';

// config file is imported in server.js
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';

// routes are imported in server.js
import userRouter from './routes/userRoutes.js';
import productRoute from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App configuration
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.listen(port, () => console.log('Server is running on port ' + port));


// server.js is the entry point of the application, it requires all the necessary modules and sets up 
// the server.
