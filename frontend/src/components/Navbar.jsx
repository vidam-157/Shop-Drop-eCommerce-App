import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false)

    const { setShowSearchBar, getCartItemCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    // function to logout the user
    const logoutUser = () => {
        navigate('/login');  // order matters here
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>

            <Link to='/'>
                <img src={assets.logo} alt='logo' className='w-36' />
            </Link>

            <ul className='hidden sm:flex gap-5 text-sm text-grey-700'>
                <NavLink to="/" className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                </NavLink>
                <NavLink to="/collection" className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                </NavLink>
                <NavLink to="/about" className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                </NavLink>
                <NavLink to="/contact" className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>

                <img className='w-5 cursor-pointer' onClick={() => setShowSearchBar(true)} src={assets.search_icon} alt='search' />

                <div className='group relative'>
                    <img className='w-5 cursor-pointer' onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} alt='' />
                    
                    {/* Drop down in the navbar */}
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 bg-white shadow-md p-4 rounded-lg'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'> My Profile </p>
                                <p className='cursor-pointer hover:text-black' onClick={() => navigate('/orders')}> Orders </p>
                                <p className='cursor-pointer hover:text-black' onClick={logoutUser}> Logout </p>
                            </div>
                        </div>}
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5' alt='' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-lg text-[8px]'> {getCartItemCount()} </p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt='menu' />
            </div>

            {/* items within the side bar menu for smaller screen */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='' />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'> HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'> COLLECTION </NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'> ABOUT </NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'> CONTACT </NavLink>
                </div>
            </div>

        </div>
    )
}

export default Navbar;
