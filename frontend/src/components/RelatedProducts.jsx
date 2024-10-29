import React, { useEffect, useState, useContext } from 'react'
import Title from './Title';
import Items from './Items';
import { ShopContext } from '../context/ShopContext';

const RelatedProducts = ({category, subCategory}) => {

    const {products} = useContext(ShopContext);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {

        if (products.length > 0) {

            let productsCopy = products.slice();

            // category and subCategory we getting from the prop should be equal to the category and subCategory in the products array
            productsCopy = productsCopy.filter(item => category === item.category);
            productsCopy = productsCopy.filter(item => subCategory === item.subCategory);

            setRelatedProducts(productsCopy.slice(0, 4));
            console.log(productsCopy.slice(0, 4));
        }
    },[products])

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={'RELATED'} text2={'PRODUCT'}></Title>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {relatedProducts.map((item, index) => (
                <Items 
                    key={index}
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price} />
            ))}
        </div>   
    </div>
  )
}

export default RelatedProducts
