import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const { token, setToken, navigate, backendURL } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState('Login');

  // state variables to store the user sign up details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userAuthHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === 'SignUp') {

        const response = await axios.post(backendURL + '/api/user/register', { name, email, password });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else {
          toast.error(response.data.message);
        }
      }
      else {
        const response = await axios.post(backendURL + '/api/user/login', { email, password });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        }
        else {
          toast.error(response.data.message);
        }
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);


  return (
    <form className='flex flex-col items-center w-[30%] sm"max-w-96 m-auto mt-14 gap-4 text-gray-800'>

      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'> {currentState} </p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {/* Form Input fields based on Login or Signup */}
      {currentState === 'Login' ? '' : <input className='w-full px-3 py-2 border border-gray-800' onChange={(e) => setName(e.target.value)} value={name} type='text' placeholder='Name' required />}
      <input className='w-full px-3 py-2 border border-gray-800' onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='Email' required />
      <input className='w-full px-3 py-2 border border-gray-800' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Password' required />


      <div className='w-full flex justify-between text-sm mt-[8px]'>
        <p className='cursor-pointer'> Forgot Password?</p>

        {/* changes due to login or signup */}
        {currentState === 'Login' ?
          <p onClick={() => setCurrentState('SignUp')} className='cursor-pointer'> Create an Account </p> :
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'> Already have an account? </p>
        }
      </div>

      <button className='bg-black text-white font-light px-10 py-2 mt-4' onClick={userAuthHandler}>
        {currentState === 'Login' ? 'LogIn' : 'SignUp'}
      </button>

    </form>
  )
}

export default Login
