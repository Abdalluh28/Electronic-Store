"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faBagShopping, faCartShopping, faHeart, faHouse, faRightFromBracket, faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';

import gsap from 'gsap';
import { Link, useNavigate } from "react-router-dom";

import Cookies from 'js-cookie';
import { useLogoutMutation } from '../redux/features/auth/authApiSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { clearCart } from '../redux/slices/cartSlice';
import { clearFavourite } from '../redux/slices/favouriteSlice';

export default function Navigation() {

    const isJWT = Cookies.get('jwt') ? true : false;
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;

    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = useSelector((state) => state.cart.total);
    const cartTotalQuantity = useSelector((state) => state.cart.quantity);
    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);
    const favouriteTotalQuantity = useSelector((state) => state.favourite.quantity);
    const [cart, setCart] = useState({});
    const [favourite, setFavourite] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (cartItems) {
            setCart({
                items: cartItems,
                totalPrice,
                cartTotalQuantity
            });
        }

        if (favouriteItems) {
            setFavourite({
                items: favouriteItems,
                favouriteTotalQuantity
            });
        }
    }, [cartItems, favouriteItems]);

    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const openSidebar = () => {
        document.querySelectorAll(".sidebarText").forEach((el) => {
            el.style.display = "block";
        });
        gsap.to(".sidebar", { duration: 0.5, width: "100%" });
    };

    const closeSidebar = () => {
        document.querySelectorAll(".sidebarText").forEach((el) => {
            el.style.display = "none";
        });
        gsap.to(".sidebar", { duration: 0.5, width: "30%" });
        const adminNav = document.querySelector('.adminNav');
        if (adminNav && !adminNav.classList.contains('hidden')) {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 100,
                opacity: 0,
                ease: "power2.out",
                onComplete: () => adminNav.classList.add('hidden')
            });
        }
    };

    const moveLink = (e) => {
        gsap.to(`.${e}`, { duration: 0.5, x: 10 });
    };

    const returnLink = (e) => {
        gsap.to(`.${e}`, { duration: 0.5, x: 0 });
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout({
            id: userInfo.id,
            cart,
            favourite: favouriteItems
        });
        dispatch(clearCart());
        dispatch(clearFavourite());
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
        });
    };

    const showAdminNav = () => {
        const adminNav = document.querySelector('.adminNav');
        if (adminNav.classList.contains('hidden')) {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 0,
                opacity: 1,
                ease: "power2.out",
                onStart: () => adminNav.classList.remove('hidden')
            });
        } else {
            gsap.to('.adminNav', {
                duration: 0.5,
                x: 100,
                opacity: 0,
                ease: "power2.out",
                onComplete: () => adminNav.classList.add('hidden')
            });
        }
    };

    return (
        <>
            <div className="nav w-32 h-screen fixed shadow-md z-50">
                <div className="sidebar h-full bg-black w-15 overflow-hidden flex flex-col"
                    onMouseEnter={openSidebar} onMouseLeave={closeSidebar}>
                    <Link to="/" className="one h-10 py-4 flex items-center m-2 mt-5"
                        onMouseOver={() => moveLink('one')} onMouseOut={() => returnLink('one')}>
                        <FontAwesomeIcon className='text-2xl mr-2' icon={faHouse} />
                        <span className="text-xl sidebarText hidden">Home</span>
                    </Link>
                    <Link to="/shop" className="two h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('two')} onMouseOut={() => returnLink('two')}>
                        <FontAwesomeIcon className='text-2xl ms-1 mr-2' icon={faBagShopping} />
                        <span className="text-xl sidebarText hidden">Shop</span>
                    </Link>
                    <Link to="/cart" className="three h-10 py-4 flex items-center m-2 relative"
                        onMouseOver={() => moveLink('three')} onMouseOut={() => returnLink('three')}>
                        <div className="relative">
                            <FontAwesomeIcon className="text-2xl mr-2" icon={faCartShopping} />
                            {cartTotalQuantity > 0 && (
                                <span className="badge absolute -top-2 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                    {cartTotalQuantity}
                                </span>
                            )}
                        </div>
                        <span className="text-xl sidebarText hidden">Cart</span>
                    </Link>
                    <Link to="/favourite" className="four h-10 py-4 flex items-center m-2"
                        onMouseOver={() => moveLink('four')} onMouseOut={() => returnLink('four')}>
                        <div className="relative">
                            <FontAwesomeIcon className="text-2xl mr-2" icon={faHeart} />
                            {favouriteTotalQuantity > 0 && (
                                <span className="badge absolute -top-2 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-md">
                                    {favouriteTotalQuantity}
                                </span>
                            )}
                        </div>
                        <span className="text-xl sidebarText hidden">Favorite</span>
                    </Link>
                    {(!isJWT || (isJWT && !userInfo.isVerified)) && (
                        <div className='mt-auto'>
                            <Link to="/auth/Login" className="five h-10 py-4 flex items-center m-2"
                                onMouseOver={() => moveLink('five')} onMouseOut={() => returnLink('five')}>
                                <FontAwesomeIcon className='text-2xl mr-2' icon={faRightToBracket} />
                                <span className="text-xl sidebarText hidden">Login</span>
                            </Link>
                            <Link to="/auth/Register" className="six h-10 py-4 flex items-center m-2"
                                onMouseOver={() => moveLink('six')} onMouseOut={() => returnLink('six')}>
                                <FontAwesomeIcon className='text-2xl mr-2' icon={faUser} />
                                <span className="text-xl sidebarText hidden">Register</span>
                            </Link>
                        </div>
                    )}
                    {isJWT && userInfo.isVerified && (
                        <div className='mt-auto'>
                            <Link to="/users/profile" className="five h-10 py-4 flex items-center m-2"
                                onMouseOver={() => moveLink('five')} onMouseOut={() => returnLink('five')}>
                                <FontAwesomeIcon className='text-2xl mr-2' icon={faUser} />
                                <span className="text-xl sidebarText hidden">Profile</span>
                            </Link>
                            <Link to="/" className="six h-10 py-4 flex items-center m-2"
                                onMouseOver={() => moveLink('six')} onMouseOut={() => returnLink('six')}
                                onClick={handleLogout}>
                                <FontAwesomeIcon className='text-2xl mr-2' icon={faRightFromBracket} />
                                <span className="text-xl sidebarText hidden">Logout</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
