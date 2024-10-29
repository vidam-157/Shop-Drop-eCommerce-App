import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyPayment = () => {
  const { navigate, token, setCartItems, backendURL } = useContext(ShopContext);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const paymentMethod = searchParams.get('paymentMethod'); // Added to capture the payment method

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      let response;

      // Determine the payment method and call the corresponding API endpoint
      if (paymentMethod === 'stripe') {
        response = await axios.post(backendURL + '/api/order/verifyStripe', { orderId, success }, { headers: { token } });
      } else if (paymentMethod === 'paypal') {
        response = await axios.post(backendURL + '/api/order/verifyPayPal', { orderId, success }, { headers: { token } });
      } else {
        console.error("Invalid payment method");
        return;
      }

      console.log(response.data);

      // Handle the response
      if (response.data.success) {
        setCartItems({}); // Clear the cart items on successful payment
        navigate('/orders');
        console.log("Success in verifying payment");
      } else {
        navigate('/cart');
        console.log("Failed to verify payment");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div>
      {/* You can add loading indicators or other UI elements here */}
      <p>Verifying payment...</p>
    </div>
  );
}

export default VerifyPayment;
