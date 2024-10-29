import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// pages
import AddProduct from './pages/Addproduct'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';


const App = () => {

  // Initialize the token state with the value from localStorage or an empty string
  const [token, setToken] = useState(() => localStorage.getItem('token') || "");

  // Save the token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return ( 
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === "" ? <Login setToken={setToken} /> :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='add' element={<AddProduct token={token}/>} />
                <Route path='list' element={<List token={token}/>} />
                <Route path='orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App
