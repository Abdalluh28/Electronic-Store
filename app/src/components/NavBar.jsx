import React, { useEffect, useState } from 'react'
import gsap from 'gsap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { useLogoutMutation } from '../redux/features/auth/authApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { clearFavourite } from '../redux/slices/favouriteSlice';

export default function NavBar() {

    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
    const isJWT = Cookies.get('jwt') ? true : false;
    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = useSelector((state) => state.cart.total);
    const cartTotalQuantity = useSelector((state) => state.cart.quantity);
    const favouriteTotalQuantity = useSelector((state) => state.favourite.quantity);
    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);
    const [cart, setCart] = useState({})
    const [favourite, setFavourite] = useState({})
    const dispatch = useDispatch();

    const location = useLocation();

    useEffect(() => {
        if (cartItems) {
            setCart({
                items: cartItems,
                totalPrice,
                totalQuantity: cartTotalQuantity
            })

        }
    }, [cartItems])

    useEffect(() => {
        if (favouriteItems) {
            setFavourite({
                items: favouriteItems,
                totalPrice,
                totalQuantity: favouriteTotalQuantity
            })

        }
    }, [favouriteItems])

    const [logout] = useLogoutMutation();
    const navigate = useNavigate();


    useEffect(() => {
        if (location) {
            const navbar = document.getElementById('navbar-hamburger')
            navbar.classList.add('hidden')
        }
    }, [location])

    const openNavBar = () => {
        const navbar = document.getElementById('navbar-hamburger')
        if (navbar.classList.contains('hidden')) {
            navbar.classList.remove('hidden')
            gsap.fromTo(navbar, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5 });
        } else {
            gsap.fromTo(navbar, { opacity: 1, x: 0 }, { opacity: 0, x: -30, duration: 0.5, onComplete: () => navbar.classList.add('hidden') });
        }
    }


    const handleLogout = (e) => {
        e.preventDefault();
        logout({
            id: userInfo.id,
            cart,
            favourite
        });
        dispatch(clearCart())
        dispatch(clearFavourite())
        Cookies.remove('accessToken');
        Cookies.remove('userInfo');
        Cookies.remove('jwt');
        toast.success('Successfully logged out', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            onOpen: () => navigate('/auth/Login'),
        });
    }

    const handleActiveLink = (path) => {
        return location.pathname === path ? 'bg-blue-700 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-400';
    }

    return (
        <>


            <nav class=" fixed top-0 z-50 w-full bg-slate-950 mb-40">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ecommerce</span>
                    </a>
                    <div className='flex gap-4 items-center'>
                        <div className='flex gap-4 items-center'>
                            {/* Favourite Link */}
                            <Link to={'/favourite'} className='relative text-white hover:text-blue-500 transition-all duration-300 ease-in-out'>
                                <FontAwesomeIcon icon={faHeart} className='text-white hover:!text-blue-500 transition-all duration-300 text-2xl ease-in-out' />
                                {favouriteTotalQuantity > 0 && (
                                    <span className='absolute -top-4 -right-3 text-white bg-red-500 rounded-full text-md w-6 h-6 flex items-center justify-center'>
                                        {favouriteTotalQuantity}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Link */}
                            <Link to={'/cart'} className='relative text-white hover:text-blue-500 transition-all duration-300 ease-in-out'>
                                <FontAwesomeIcon icon={faCartShopping} className='text-white hover:!text-blue-500 transition-all duration-300 text-2xl ease-in-out' />
                                {cartTotalQuantity > 0 && (
                                    <span className='absolute -top-4 -right-1 text-white bg-red-500 rounded-full text-md w-6 h-6 flex items-center justify-center'>
                                        {cartTotalQuantity}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <button data-collapse-toggle="navbar-hamburger" type="button" class="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-hamburger" aria-expanded="false"
                            onClick={openNavBar}>
                            <span class="sr-only">Open main menu</span>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div class="hidden w-full" id="navbar-hamburger">
                        <ul class="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                            <li>
                                <Link to={'/'} class={`block py-2 px-3 my-1 rounded ${handleActiveLink('/')}`} aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link to={'/shop'} class={`block py-2 px-3 my-1 rounded ${handleActiveLink('/shop')}`}>Shop</Link>
                            </li>
                            <li>
                                <Link to={'/users/profile'} class={`block py-2 px-3 my-1 rounded ${handleActiveLink('/users/profile')}`}>Profile</Link>
                            </li>
                            <li>
                                {isJWT && userInfo.isVerified ? (
                                    <button
                                        className="block py-2 px-3 mb-2 ms-2 rounded btn btn-primary text-white"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        to={'/auth/login'}
                                        className="block py-2 px-3 mb-2 ms-2 rounded btn btn-primary text-white w-fit"
                                    >
                                        Login
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}
