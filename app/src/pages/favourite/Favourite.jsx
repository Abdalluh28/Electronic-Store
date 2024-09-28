import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faEye, faMinus, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';

import gsap from 'gsap';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { clearFavourite, removeItemFromFavourite } from '../../redux/slices/favouriteSlice';
import { useClearFavouriteDBMutation } from '../../redux/features/favourite/favouriteApiSlice';
import Swal from 'sweetalert2';

export default function Favorite() {


    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);
    const totalQuantity = useSelector((state) => state.favourite.quantity);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isJWT = Cookies.get('jwt') ? true : false;
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;

    const [clearFavouriteDB] = useClearFavouriteDBMutation();

    const [openMenuId, setOpenMenuId] = useState(null);


    useEffect(() => {
        if (favouriteItems) {
            console.log(favouriteItems)
        }
    }, [favouriteItems])

    const handleRemoveItemFromFavourite = (id, name) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You will remove ${name} from your favourite`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeItemFromFavourite(id));
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


    const handleClearFavourite = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will clear your favourite',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(clearFavourite());
                handleClearFavouriteDB();
            }
        })

    }

    const handleClearFavouriteDB = async () => {
        if (isJWT && userInfo.isVerified) {
            const { data } = await clearFavouriteDB({ id: userInfo.id })

            if (data) {
                toast.success('Favourite cleared successfully', {
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
                    <h1 className='text-3xl font-bold my-2'>Favourite</h1>
                    <div className='text-sm flex gap-2 text-gray-400'>
                        <Link to={"/"} className='hover:text-blue-500 transition-all duration-300 ease-in-out'>Home</Link>
                        <span>&gt; Favourite</span>
                    </div>
                </div>
                {favouriteItems.length === 0 ? (
                    <>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='text-center text-4xl mt-10 font-bold'>Your Favourite is empty</div>
                            <Link to={"/shop"} className='text-center text-2xl mt-10 font-bold bg-white hover:!bg-blue-500 text-black hover:!text-white py-2 px-4 rounded-xl transition-all duration-500 ease-in-out'>Continue Shopping</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            {/* favourite items */}
                            <div className='grid grid-cols-5 mt-3 text-xl'>
                                <div className='lg:col-span-2 col-span-3'>Product</div>
                                <div className='col-span-1 '>Price</div>
                            </div>

                            {favouriteItems.map((item, index) => (
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
                                        <div className='col-span-1 lg:flex hidden  items-center'>
                                            <Link to={`/product/${item.id}`} className='btn btn-primary flex justify-center items-center gap-1 w-fit px-4 text-lg' >
                                                <FontAwesomeIcon icon={faEye} className='mt-1' />
                                                <span>View</span>
                                            </Link>
                                        </div>
                                        <div className='col-span-1 items-center lg:flex hidden'>
                                            <button
                                                onClick={() => handleRemoveItemFromFavourite(item.id, item.name)}
                                                className='btn btn-danger flex justify-center items-center gap-1 px-4 text-lg'
                                            >
                                                <FontAwesomeIcon icon={faXmark} className='mt-1' />
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
                                                    <Link to={`/product/${item.id}`} className='btn btn-primary flex gap-1 w-24 mb-2'>
                                                        <FontAwesomeIcon icon={faEye} className='mt-1 text-lg' />
                                                        <span>View</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemoveItemFromFavourite(item.id, item.name)}
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
                            <div className='lg:w-[90%] w-full flex justify-between lg:flex-row flex-col-reverse'>
                            <div className='ps-3 xl:w-1/4 lg:w-1/3 sm:w-1/2 w-full mt-5'></div>
                                <div className='mt-4 sm:mt-0 lg:self-start self-end '>
                                    {/* clear favourite */}
                                    <button
                                        onClick={handleClearFavourite}
                                        className='bg-white hover:!bg-red-600 text-black hover:!text-white transition-all duration-300 ease-in-out flex justify-center items-center gap-1 px-4 py-2 rounded-lg'
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                        <span>Clear Favourite</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </>
    )
}
