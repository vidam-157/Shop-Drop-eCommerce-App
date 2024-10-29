import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

  const { navigate, backendURL, token, cartItems, setCartItems, getCartTotal, delivery_fee, products } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {

    const name = event.target.name;
    const value = event.target.value;

    setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {

    event.preventDefault();

    try {

      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartTotal() + delivery_fee
      }

      switch (paymentMethod) {

        // API call for COD
        case 'cod':
          const response = await axios.post(backendURL + '/api/order/place/cash', orderData, { headers: {token} })
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          }
          else {
            toast.error(response.data.message);
          }
          break;
        
        // API call for Stripe
        case 'stripe':
          const stripeResponse = await axios.post(backendURL + '/api/order/place/stripe', orderData, { headers: {token} });

          if (stripeResponse.data.success) {
            const { session_url } = stripeResponse.data;
            window.location.replace(session_url);
          }
          else {
            toast.error(stripeResponse.data.message);
            console.log(stripeResponse.data.message);
          }
          break;
      
        // API call for PayPal
        case 'paypal':
          const paypalResponse = await axios.post(backendURL + '/api/order/place/paypal', orderData, { headers: {token} });
          console.log("hellow");
          console.log(paypalResponse.data);
          if (paypalResponse.data.success) {
            const { session_url } = paypalResponse.data;
            window.location.replace(session_url);
          }
          else {
            toast.error("An error occurred while processing PayPal payment");
            console.log(paypalResponse.data.message);
          }
          break;
        default:
          toast.error('Invalid payment method');
          break;
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t px-4 sm:px-8'
      onSubmit={onSubmitHandler}>

      {/* -------------------------- Left side of the page -------------------------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[48%]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='firstName' value={formData.firstName} type='text' placeholder='First name' required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='lastName' value={formData.lastName} type='text' placeholder='Last name' required />
        </div>

        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='email' value={formData.email} type='email' placeholder='Email address' required />
        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='street' value={formData.street} type='text' placeholder='Street' required />

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='city' value={formData.city} type='text' placeholder='City' required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='state' value={formData.state} type='text' placeholder='State' required />
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type='number' placeholder='Zipcode' required />
          <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='country' value={formData.country} type='text' placeholder='Country' required />
        </div>

        <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' onChange={onChangeHandler} name='phone' value={formData.phone} type='number' placeholder='Phone Number' required />
      </div>

      {/* ------------------------- Right side of the page ----------------------------- */}
      <div className='w-full sm:max-w-[48%] mt-8 sm:mt-0'>
        <div className='mt-8'>
          <CartTotal />
        </div>

        {/* ------------------------------- Payment method selection ------------------------ */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex flex-col lg:flex-row lg:flex-row gap-3'>
            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={() => setPaymentMethod('stripe')}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt='Stripe' />
            </div>

            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={() => setPaymentMethod('paypal')}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'paypal' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.paypal_logo} alt='paypal' />
            </div>

            <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={() => setPaymentMethod('cod')}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button className='bg-black text-white px-16 py-3 text-sm' type='submit' > PLACE ORDER </button>
          </div>

        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
