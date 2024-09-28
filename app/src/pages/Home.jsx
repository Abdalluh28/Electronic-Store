import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Slider from '../components/Slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDivide, faDollarSign, faLock, faTruck } from '@fortawesome/free-solid-svg-icons';
import HomeCategories from '../components/HomeCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import { useSelector } from 'react-redux';
export default function Home() {


    const [active, setActive] = useState(0);

    const cartItems = useSelector((state) => state);

    useEffect(() => {
        if (cartItems) {
            console.log(cartItems)
        }
    },[cartItems])
    

    return (
        <>
            <Slider />
            <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 my-10 lg:my-14'>
                <div className='sm:mb-0 mb-3 flex justify-center items-center gap-3 '>
                    <div className='w-1/3 flex justify-end'>
                        <FontAwesomeIcon className='text-4xl' icon={faTruck} />
                    </div>
                    <div className='w-2/3'>
                        <div>
                            <h2 className='text-xl font-bold'>Fast Delivery</h2>
                            <p>Orders from all items</p>
                        </div>
                    </div>
                </div>
                <div className='sm:mb-0 mb-3 flex justify-center items-center gap-3 '>
                    <div className='w-1/3 flex justify-end'>
                        <FontAwesomeIcon className='text-4xl sm:mr-0 mr-3' icon={faDollarSign} />
                    </div>
                    <div className='w-2/3'>
                        <div>
                            <h2 className='text-xl font-bold'>Return & Refund</h2>
                            <p>Money back guarantee</p>
                        </div>
                    </div>
                </div>
                <div className='sm:mb-0 mb-3 flex justify-center items-center gap-3 '>
                    <div className='w-1/3 flex justify-end'>
                        <FontAwesomeIcon className='text-4xl' icon={faDivide} />
                    </div>
                    <div className='w-2/3'>
                        <div>
                            <h2 className='text-xl font-bold'>Support 24/7</h2>
                            <p>Contact us 24 hours a day</p>
                        </div>
                    </div>
                </div>
                <div className='sm:mb-0 mb-3 flex justify-center items-center gap-3 '>
                    <div className='w-1/3 flex justify-end'>
                        <FontAwesomeIcon className='text-4xl' icon={faLock} />
                    </div>
                    <div className='w-2/3'>
                        <div>
                            <h2 className='text-xl font-bold'>Secure Checkout</h2>
                            <p>100% secure payment</p>
                        </div>
                    </div>
                </div>
            </div>
            <HomeCategories />

            {/* featured products */}
            <div className='mt-20'>
                <div className='flex justify-between sm:items-center items-start sm:flex-row flex-col'>
                    <h1 className='text-3xl font-bold sm:mb-0 mb-3'>Featured Products</h1>
                    <hr className='w-1/3 lg:flex hidden' />
                    <div className='flex gap-5 mr-10'>
                        <button className={`btn btn-danger text-xl ${active === 0 ? 'active' : ''}`}
                        onClick={() => setActive(0)}>New</button>
                        <button className={`btn btn-danger text-xl ${active === 1 ? 'active' : ''}`}
                        onClick={() => setActive(1)}>Top</button>
                    </div>
                </div>
                <FeaturedProducts active={active} />
            </div>
        </>
    )
}
