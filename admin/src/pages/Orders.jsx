import React, { useState, useEffect } from 'react'
import { backendURL, currency } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {

  const [allOrders, setAllOrders] = useState([]);

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    };

    try {
      const response = await axios.post(backendURL + "/api/order/list", {},
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,  // Add "Bearer " before the token
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setAllOrders(response.data.orders.reverse());
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // function to change the delivary status of the order
  const statusHandler = async (event, orderId) => {
    const status = event.target.value;
  
    try {
      const response = await axios.post(backendURL + "/api/order/status", { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update the order status locally
        setAllOrders((prevOrders) => 
          prevOrders.map(order => 
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success('Order status updated');
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h3> Order Page </h3>
      <div>
        { allOrders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
            key={index}>
            <img src={assets.parcel_icon} alt='' />

            <div>
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                }
                else {
                  return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> , </p>
                }
              })}
            </div>

            <p className='mt-3 mb-2 font-medium'> {order.address.firstName + " " + order.address.lastName} </p>
            <div>
              <p> {order.address.street + ", "} </p>
              <p> {order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode} </p>
              <p> {order.address.phone} </p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'> Items : {order.items.length} </p>
              <p className='mt-3'> Method : {order.paymentMethod} </p>
              <p> Payment : {order.payement ? 'Done' : 'Pending'} </p>
              <p> Date : {new Date(order.date).toLocaleDateString()} </p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>{currency} {order.amount}</p>
            </div>
            <div>
              <select className='p-2 font-semibold' onChange={(event) => statusHandler(event, order._id)} value={order.status} >
                <option value="Order Placed"> Order Placed </option>
                <option value="Packing"> Packing </option>
                <option value="Shipped"> Shipped </option>
                <option value="Out for delivery"> Out for delivery </option>
                <option value="Delivered"> Delivered </option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders;