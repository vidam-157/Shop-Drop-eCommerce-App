import React, {useContext, useEffect, useState} from 'react'
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearchBar, setShowSearchBar } = useContext(ShopContext);

    const [ visibleSearchBar, setVisibleSearchBar ] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisibleSearchBar(true);
        }
        else {
            setVisibleSearchBar(false);
        }
    }, [location])

  return showSearchBar && visibleSearchBar ?  (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-300 px-5 py-2 mx-3 my-3 rounded-full w-3/4 sm:w-1/2'>
            <input className='flex-1 outline-none bg-inherit text-sm'
                value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search items'/>
            <img className='w-4 cursor-pointer' src={assets.search_icon} alt='search' />
        </div>
        <img className='inline w-3 cursor-pointer' onClick={() => setShowSearchBar(false)} src={assets.cross_icon} alt='close' />
    </div>
  ) : null
}

export default SearchBar
