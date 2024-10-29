import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'

const About = () => {

  return (

    <div>

      <div className='text-2xl text-center pt-8 border-t'> 
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=''/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p> <b> Welcome to ShopDrop, your one-stop destination for curated fashion.</b> Our mission is to empower individuals to 
              express their unique style through our carefully selected collection of trendy and affordable clothing. 
              We believe that fashion should be accessible and enjoyable for everyone, and we strive to provide a seamless
              shopping experience that inspires confidence.</p>
          <p> <b>At ShopDrop, we are passionate about quality, comfort, and sustainability.</b> Our team of fashion experts handpicks 
              each item to ensure it meets our high standards of design and craftsmanship. We are committed to supporting ethical 
              and responsible practices in the fashion industry, and we are proud to offer a range of sustainable options. 
              Discover the latest trends, timeless classics, and hidden gems at ShopDrop and elevate your wardrobe today.</p>
          <b className='text-gray-800'> Our Mission</b>
          <p> Our mission at ShopDrop is to inspire and empower individuals to express their unique style through thoughtfully curated fashion.
              We believe that clothing is more than just garments; it's a form of self-expression. By offering a diverse collection of trendy 
              and affordable pieces, we aim to make fashion accessible and enjoyable for everyone while committing to provide a seamless shopping 
              experience that fosters confidence and creativity. </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b> Quality Assurance:</b>
          <p className='text-gray-600'> ncjsnjs sd cjis jis cjisd cjisd wefoiw do ds jsi wjiew ji wipeuf jdsc ;a pjiw </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b> Convineance:</b>
          <p className='text-gray-600'> fnopnguipndo j nuip qcfjognuifnoiq guip f wcqgnfip ji joinoi  nfuie fj fopnfiw emrik </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b> Exceptional Customer Service:</b>
          <p className='text-gray-600'> uefbeuif ji fji dwji fji djo jk jk djw fjow jo f fwnfwfnwefnowo dj ji ofwj  </p>
        </div>

      </div>
      
        <NewsLetter />

    </div>
  )
}

export default About
