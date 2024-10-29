import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import Items from '../components/Items';

const Collection = () => {

  const { products, search, showSearchBar, cartItems } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');


  // Functions for choosing category and subcategory
  const chooseCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value)); // Remove the selected category from the array by re-clicking
    }
    else {
      setCategory(prev => [...prev, e.target.value]); // Add the category to array (if not yet selected)
    }
  }

  const chooseSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value)); // Remove the selected category from the array by re-clicking
    }
    else {
      setSubCategory(prev => [...prev, e.target.value]); // add the category to array (if not yet selected)
    }
  }

  // Function to apply selected category filters
  const applyFilters = () => {

    let productsCopy = products.slice();

    if (showSearchBar && search) {
      productsCopy = products.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));  // seraching happens here
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
   
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }

    setFilteredProducts(productsCopy);
  }

  // apply relevant filters
  const sortPorduct = () => {

    let copyProductFilter = filteredProducts.slice();

    switch (sortType) {

      case 'low-high':
        setFilteredProducts(copyProductFilter.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilteredProducts(copyProductFilter.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilters();
        break;
    }
  }

  // Use effects to render products
  useEffect(() => {
    setFilteredProducts(products);
  },[])

  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, showSearchBar, products]);

  useEffect(() => {
    sortPorduct();
  }, [sortType]);

  return (

    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

{/* Left Side of the Screen */}
      {/* filter options */}
      <div className='min-w-60'>

        <p className='my-2 text-xl flex items-center cursor-pointer gap-2'
        onClick={() => setShowFilter(!showFilter)}> FILTERS 
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
          src={assets.dropdown_icon} alt='dropdown' onClick={() => setShowFilter(!showFilter)} />
        </p>

        {/* Category Filter */}
{/* The element is visible in small screens because sm:hidden doesn't apply to screens below 640px. The 
coded rule "sm:hidden" is activated only when screen size is 640px or wider */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'> CATEGORIES </p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Men'} onChange={chooseCategory} /> Men
            </p>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Women'} onChange={chooseCategory} /> Women
            </p>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Kids'} onChange={chooseCategory} /> Kids
            </p>
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'> TYPES </p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Topwear'} onChange={chooseSubCategory} /> Top-wear
            </p>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Bottomwear'} onChange={chooseSubCategory}/> Bottom-wear
            </p>
            <p className='flex-gap-2'>
              <input className='w-3' type='checkbox' value={'Winterwear'} onChange={chooseSubCategory}/> Winter-wear
            </p>
          </div>
        </div>
          
      </div>

{/* Right Side of the screen */}

      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant"> Sort by: Relavent </option>
            <option value="low-high"> Sort by: Low to High </option>
            <option value="high-low"> Sort by: High to Low </option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 '>
          { filteredProducts.map((item, index) => (
            <Items 
              key={index}
              id={item._id}
              image={item.image} 
              name={item.name} 
              price={item.price} />
          ))}
        </div>
      </div>

  </div>
  )
}

export default Collection;
