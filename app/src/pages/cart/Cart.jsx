import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart, clearCart, editTotalPrice, minusItemFromCart, plusItemToCart, removeItemFromCart } from '../../redux/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faMinus, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import Cookies from 'js-cookie';
import { useClearCartDBMutation } from '../../redux/features/cart/cartApiSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Cart() {


    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = useSelector((state) => state.cart.total);
    const totalQuantity = useSelector((state) => state.cart.quantity);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isJWT = Cookies.get('jwt') ? true : false;
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;

    const [clearCartDB] = useClearCartDBMutation();

    const [openMenuId, setOpenMenuId] = useState(null);
    const [quantities, setQuantities] = useState([]);
    const [price, setPrice] = useState(0)


    useEffect(() => {
        if (cartItems) {
            console.log(cartItems)
            setQuantities(cartItems.map((item) => item.quantity));
            setPrice(totalPrice)
        }
    }, [cartItems])

    const handleRemoveItemFromCart = (id, name) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You will remove ${name} from your cart`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeItemFromCart(id));
                toast.success(`${name} removed successfully`, {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }


    const handleClearCart = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will clear your cart',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(clearCart());
                handleClearCartDB();
            }
        })


    }

    const handleClearCartDB = async () => {
        if (isJWT && userInfo.isVerified) {
            const { data } = await clearCartDB({ id: userInfo.id })

            if (data) {
                toast.success('Cart cleared successfully', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }


    const handleMenuClick = (id) => {
        setOpenMenuId((prevId) => (prevId === id ? null : id));

    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.menu-container')) {
            setOpenMenuId(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (openMenuId) {
            const targets = document.querySelectorAll(`#btn-${openMenuId}`);
            gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 });
        }
    }, [openMenuId]);


    const handleCartChange = (id, value, sign) => {
        if (value < 1) return
        const item = cartItems.find((item) => item.id === id);
        if (sign === '+') {
            dispatch(plusItemToCart({ id }));
        } else if (sign === '-') {
            dispatch(minusItemFromCart({ id }));
        } else {
            value -= item.quantity
            dispatch(addItemToCart({ ...item, quantity: value, price: item.price }));
        }

    }


    const handleChangeTotalPrice = (value) => {
        setPrice(totalPrice + value)
    }

    const handleCheckout = () => {
        if (!isJWT || !userInfo.isVerified) {
            navigate('/auth/Login')
            return
        }
        dispatch(editTotalPrice({ price }));
        navigate('/checkout')
    }


    const handleLinkEnterHover = (id) => {
        const target = document.getElementById(`btn-${id}`);

        gsap.fromTo(target, {
            borderBottom: '2px solid rgba(255, 255, 255, 0)',
            paddingBottom: '2px'
        },
            {
                borderBottom: '2px solid rgba(255, 255, 255, 1)',
                duration: 0.5,
                ease: "power1.inOut"
            });
    }


    const handleLinkLeaveHover = (id) => {
        const target = document.getElementById(`btn-${id}`);

        gsap.fromTo(target, {
            borderBottom: '2px solid rgba(255, 255, 255, 1)',
            paddingBottom: '2px'
        }, {
            borderBottom: '2px solid rgba(255, 255, 255, 0)',
            duration: 0.5,
            ease: "power1.inOut"
        })
    }


    return (
        <>
            <div className=''>
                <div className=''>
                    <h1 className='text-3xl font-bold my-2'>Shopping Cart</h1>
                    <div className='text-sm flex gap-2 text-gray-400'>
                        <Link to={"/"} className='hover:text-blue-500 transition-all duration-300 ease-in-out'>Home</Link>
                        <span>&gt; Shopping Cart</span>
                    </div>
                </div>
                {cartItems.length === 0 ? (
                    <>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='text-center text-4xl mt-10 font-bold'>Your cart is empty</div>
                            <Link to={"/shop"} className='text-center text-2xl mt-10 font-bold bg-white hover:!bg-blue-500 text-black hover:!text-white py-2 px-4 rounded-xl transition-all duration-500 ease-in-out'>Continue Shopping</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            {/* cart */}
                            <div className='grid grid-cols-5 mt-3 text-xl'>
                                <div className='lg:col-span-2 col-span-3'>Product</div>
                                <div className='col-span-1 '>Price</div>
                                <div className='col-span-1 lg:block hidden'>Quantity</div>
                            </div>

                            {cartItems.map((item, index) => (
                                <>

                                    <div className='grid grid-cols-5 mt-3 text-xl'>
                                        <div className='lg:col-span-2 col-span-3 flex items-center gap-3'>
                                            <Link to={`/product/${item.id}`} className='w-14 h-14'>
                                                <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-sm' />
                                            </Link>
                                            <Link to={`/product/${item.id}`} className='w-[70%] mr-2'
                                                onMouseEnter={() => handleLinkEnterHover(item.id)}
                                                onMouseLeave={() => handleLinkLeaveHover(item.id)}>
                                                <p id={`btn-${item.id}`} className='w-fit'>{item.name}</p>
                                            </Link>
                                        </div>
                                        <div className='col-span-1 flex items-center'>${item.price}</div>
                                        <div className='col-span-1 lg:block hidden '>
                                            <div className='w-fit  p-2 rounded-xl flex items-center'>
                                                <FontAwesomeIcon className='text-md cursor-pointer hover:text-red-400' icon={faMinus}
                                                    onClick={() => handleCartChange(item.id, quantities[index], '-')} />
                                                <input type="number" className='w-24 text-center bg-transparent border-0' value={quantities[index]}
                                                    onChange={(e) => handleCartChange(item.id, e.target.value)}
                                                />
                                                <FontAwesomeIcon className='text-md cursor-pointer hover:text-red-400' icon={faPlus}
                                                    onClick={() => handleCartChange(item.id, quantities[index], '+')} />
                                            </div>
                                        </div>
                                        <div className='col-span-1 items-center lg:flex hidden'>
                                            <button
                                                onClick={() => handleRemoveItemFromCart(item.id, item.name)}
                                                className=' btn btn-danger flex justify-center items-center gap-1 px-4 text-lg'
                                            >
                                                <FontAwesomeIcon icon={faXmark} className='mt-1 text-lg' />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                        <div className='relative lg:hidden flex justify-end items-center menu-container'>
                                            <FontAwesomeIcon
                                                icon={faEllipsis}
                                                className='cursor-pointer p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition-colors duration-300'
                                                onClick={() => handleMenuClick(item.id)}
                                            />
                                            {openMenuId === item.id && (
                                                <div id={`btn-${item.id}`} className='absolute right-10 -top-5  flex flex-col items-center bg-slate-950 z-50'>
                                                    <div className='w-fit p-2 rounded-xl flex items-center '>
                                                        <FontAwesomeIcon className='text-md cursor-pointer hover:text-red-400' icon={faMinus}
                                                            onClick={() => handleCartChange(item.id, quantities[index], '-')} />
                                                        <input type="number" className='w-24 text-center bg-transparent border-0 text-2xl' value={quantities[index]}
                                                            onChange={(e) => handleCartChange(item.id, e.target.value)}
                                                        />
                                                        <FontAwesomeIcon className='text-md cursor-pointer hover:text-red-400' icon={faPlus}
                                                            onClick={() => handleCartChange(item.id, quantities[index], '+')} />
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItemFromCart(item.id, item.name)}
                                                        className=' btn btn-danger flex gap-1 w-24'
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} className='mt-1 text-lg' />
                                                        <span>Remove</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ))}

                            {/* Subtotal */}
                            <div className='flex justify-between lg:grid grid-cols-5 mt-5'>
                                <div className='lg:col-span-1'>
                                    <button
                                        onClick={handleCheckout}
                                        className='bg-white text-black py-2 px-5 text-lg rounded-lg w-fit my-2 hover:!bg-blue-600 hover:!text-white transition-all duration-300 ease-in-out'
                                    >
                                        Checkout
                                    </button>
                                </div>
                                <div className='lg:col-span-3 lg:block hidden'></div>
                                <div className='lg:col-span-1'>
                                    {/* clear cart */}
                                    <button
                                        onClick={handleClearCart}
                                        className='bg-white hover:!bg-red-600 text-black hover:!text-white transition-all duration-300 ease-in-out flex justify-center items-center gap-1 px-4 py-2 rounded-lg'
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                        <span className='w-fit' >Clear Cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {/* 
                    saving the cart to db if: 
                        - user checked out (will be made in order page)
                        - user logged in (merge the cart with logged in user cart)
                        - user logged out
                */}

            </div>
        </>
    )
}
