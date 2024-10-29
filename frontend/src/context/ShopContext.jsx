import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    // for the search bar
    const [ search, setSearch ] = useState('');
    const [ showSearchBar, setShowSearchBar ] = useState(false);
    const [ cartItems, setCartItems ] = useState({});
    const [ products, setProducts ] = useState([]);

    const [ token, setToken ] = useState('');

    const navigate = useNavigate();

    // function to add the item to the cart
    const addToCart = async (itemId, size) => {

      if (!size) {
        toast.error('Please select a size');
        return;
      }

      let cartItemsCopy = structuredClone(cartItems); // creating a deep copy of the cartItems object

      if (cartItemsCopy[itemId]) {
        if (cartItemsCopy[itemId][size]) {
          cartItemsCopy[itemId][size] += 1;  // if the cart have an item with the same size, increment the quantity
        }
        else {
          cartItemsCopy[itemId][size] = 1; // if the cart have an item with different size, add the item to the cart
        }
      }
      else {
        cartItemsCopy[itemId] = {}; // if the cart is empty, add the item to the cart
        cartItemsCopy[itemId][size] = 1;
      }
      setCartItems(cartItemsCopy);

      // if the user is logged in, update the cart in the database
      if (token) {
        try {
          await axios.post(backendURL + '/api/cart/add', { itemId, size }, {headers: {token}});
        }
        catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }   
    }
    
    // Update the cart count
    const getCartItemCount = () => {

      let totalCount = 0;

      for (const item in cartItems) {  // iterates over each product item (key) in the cartItems object
        for (const size in cartItems[item]) {  // iterates over each size in the product item
          try {
            if (cartItems[item][size] > 0) {
              totalCount += cartItems[item][size];
            } 
          }
          catch (error) {
            console.log(error);
          }
        }
      }
      return totalCount;

    }

    // delete item and update item quantity from the cart
    const updateQuantity  = async (itemId, size, quantity) => {
      
      let cartItemsCopy = structuredClone(cartItems);
      
      cartItemsCopy[itemId][size] = quantity;

      setCartItems(cartItemsCopy);

      if (token) {
        try {
          await axios.post(backendURL + '/api/cart/update', { itemId, size, quantity }, {headers: {token}});
        }
        catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }

    }

    // function to get the total price of the cart items
    const getCartTotal = () => {

      let totalAmount = 0;

      for (const items in cartItems) {
        let itemInfo = products.find((product) => product._id === items);
        console.log(cartItems[items]);
        for (const size in cartItems[items]) {
          try {
            if (cartItems[items][size] > 0) {
              totalAmount += itemInfo.price * cartItems[items][size];
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      return totalAmount;
    }

    const getProductsData = async () => {

      try {
        const response = await axios.get(backendURL + '/api/product/list');
        if (response.data.success) {
          setProducts(response.data.products);
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

  // function to get the user cart from the database
  const getUserCart = async (token) => {

    try {

      const response = await axios.get(backendURL + '/api/cart/get', {headers: {token}});

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
      else {
        // toast.error(response.data.message);
        toast.error(" fucked up harder");
        console.log(response.data)
      }
    } 
    catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  }, []);

    const value = {
      products, 
      currency, delivery_fee,
      search, setSearch, showSearchBar, setShowSearchBar,
      cartItems, setCartItems,
      addToCart,
      getCartItemCount, 
      updateQuantity,
      getCartTotal,
      navigate,
      backendURL,
      setToken, token
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )

}

export default ShopContextProvider;
