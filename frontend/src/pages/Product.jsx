import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();  // get the product id from the url (see app.jsx)

  const { products, currency, addToCart } = useContext(ShopContext);

  const [ productData, setProductData ] = useState(null);
  const [ image, setImage ] = useState('');
  const [ size, setSize ] = useState('');

  
  const fetchProductData = async () => {

    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }

  }

  useEffect (() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* --------------- Product data --------------------*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal'>
            {
              // click on the image to display on the main image
              productData.image.map((item, index) => (
                <img className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' 
                  src={item} key={index} onClick={() => setImage(item)} alt='img'/>
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full height-auto' src={image} alt=''/>
          </div>
        </div>

        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-2 mt-2'>  
            <img className="w-3 5" src={assets.star_icon} alt="" />        
            <img className="w-3 5" src={assets.star_icon} alt="" />        
            <img className="w-3 5" src={assets.star_icon} alt="" />        
            <img className="w-3 5" src={assets.star_icon} alt="" />        
            <img className="w-3 5" src={assets.star_dull_icon} alt="" />
            <p className='pl-2'>(122)</p>     
          </div>
          <p className='text-3xl mt-5 font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p> Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
              <button className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} 
                  key={index} onClick={() => setSize(item)}> {item}
              </button>
              ))}
            </div>
          </div>
          <button className='bg-black text-white py-3 px-8 active:bg-gray-700' onClick={() =>addToCart(productData._id, size)}> ADD TO CART </button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p> 100% Original Product. </p>
            <p> Cash on delivary available. </p>
            <p> Easy return and exchange policy within 7 days. </p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <p className='border px-5 py-3 text-sm'> Description </p>
          <p className='border px-5 py-3 text-sm'> Reviews (122) </p>
        </div>
      
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>eruifbei fbeuif euif euif qwuinq e0rne oq dqi ior qoifnrn fi kfiogjj rfnu9 vuffoignj oifnoif </p>
          <p> fnfnpen  nfun  infn ui ui 3uff 3nt893n f93 fji urf qji uiqrui fji uru1 fq fui i fji u fuiu fui f </p>
        </div>
      </div>

      {/* Display related product */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />


    </div>

  ) : <div className='opacity-0'>Loading...</div>
}

export default Product
