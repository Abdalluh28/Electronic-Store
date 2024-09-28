import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCheck, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../redux/slices/cartSlice';
import { addItemToFavourite } from '../redux/slices/favouriteSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';


export default function ProductCard({ product, index, image, categories }) {

    const [hoveredIndex, setHoveredIndex] = useState(null); // Track the hovered product
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [isLoadingFavourite, setIsLoadingFavourite] = useState(false);
    const [isAddedToFavourite, setIsAddedToFavourite] = useState(false);

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);

    const navigate = useNavigate();

    useEffect(() => {
        if (favouriteItems) {
            favouriteItems.map((item) => {
                if (item.id === product?._id) {
                    setIsAddedToFavourite(true)
                }
            })
        }
    }, [favouriteItems])



    const handleActionsMenu = (index) => {
        const actions = document.querySelectorAll('.actions');

        if (hoveredIndex === index) return; // Prevent re-triggering for the same element
        setHoveredIndex(index); // Set the current hover index

        actions[index].classList.remove('opacity-0'); // Ensure visibility
        gsap.fromTo(actions[index], { opacity: 0, x: -30 }, { opacity: 1, x: -60, duration: 0.5 });
    };

    const resetHoverState = () => {
        const actions = document.querySelectorAll('.actions');
        actions.forEach((action) => action.classList.add('opacity-0'));
        setHoveredIndex(null); // Reset hover state when mouse leaves the product card
    };




    const handleAddToCart = () => {
        if (isLoadingCart) return
        dispatch(addItemToCart({
            id: product?._id,
            name: product?.name,
            image: image,
            price: product?.price,
            quantity: 1
        }))

        toast.success('Added to cart', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onOpen: () => {
                setIsLoadingCart(true)
            },
            onClose: () => {
                setIsLoadingCart(false)
            }
        })

    }


    const handleAddToFavourite = () => {
        if (isLoadingFavourite) return
        const existingItem = favouriteItems.find((item) => item.id === product?._id);
        if (existingItem) return
        dispatch(addItemToFavourite({
            id: product?._id,
            name: product?.name,
            image: image,
            price: product?.price
        }))

        toast.success('Added to favourite', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onOpen: () => {
                setIsLoadingFavourite(true)
            },
            onClose: () => {
                setIsLoadingFavourite(false)
                setIsAddedToFavourite(true)
            }
        })


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
            <div
                className='flex justify-center items-center parentDiv cursor-pointer h-[400px]'
                key={product?._id}
                onMouseEnter={() => handleActionsMenu(index)} // Trigger animation once on hover enter
                onMouseLeave={resetHoverState} // Reset hover state on hover leave
            >
                <div className='childDiv sm:mb-0 mb-3 flex justify-center items-center gap-3 flex-col w-full pb-2 rounded-xl h-full'>
                    <div className='h-full bg-white w-full flex justify-center items-center rounded-xl overflow-hidden'>
                        <img className='w-56 h-56' src={image} alt={product?.name} />
                    </div>
                    <div className='h-1/3 w-full ps-2'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm text-gray-500'>
                                {categories?.find((category) => category._id === product?.category)?.name}
                            </p>
                            <Link to={`/product/${product?._id}`} className='w-[70%]'
                                onMouseEnter={() => handleLinkEnterHover(product?._id)}
                                onMouseLeave={() => handleLinkLeaveHover(product?._id)}>
                                <p id={`btn-${product?._id}`} className='w-fit text-lg'>{product.name}</p>
                            </Link>
                            <p className='text-gray-400'>${product?.price}</p>
                        </div>
                    </div>
                </div>
                <div className='opacity-0 -translate-x-10 flex flex-col bg-slate-100 text-dark text-lg rounded-sm shadow-2xl actions'>
                    <OverlayTrigger placement="left" overlay={<Tooltip className='text-lg'>Add to cart</Tooltip>}>
                        <FontAwesomeIcon
                            className='border-b-2 cursor-pointer hover:text-white hover:bg-[#0d6efd] transition-all duration-500 p-2'
                            icon={isLoadingCart ? faCheck : faCartShopping}
                            onClick={handleAddToCart}
                        />
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip className='text-lg'>View product</Tooltip>}>
                        <FontAwesomeIcon
                            className='border-b-2 cursor-pointer hover:text-white hover:bg-[#0d6efd] transition-all duration-500 p-2'
                            icon={faEye}
                            onClick={() => navigate(`/product/${product?._id}`)}
                        />
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={<Tooltip className='text-lg'>Wishlist</Tooltip>}>
                        <FontAwesomeIcon
                            className={`border-b-2 cursor-pointer transition-all duration-500 p-2 ${isAddedToFavourite ? 'text-white bg-[#0d6efd]' : 'hover:text-white hover:bg-[#0d6efd]'}`}
                            icon={isLoadingFavourite ? faCheck : faHeart}
                            onClick={handleAddToFavourite}
                        />

                    </OverlayTrigger>

                </div>
            </div>
            <style>
                {`
                    .childDiv {
                        transition: all 0.5s ease-in-out;
                        box-shadow: inset 0 0 1px 2px hsla(0, 0%, 100%, 0.2),
                        0 0 0 2px hsla(230, 13%, 9%, 0.15),
                        0 1px 2px hsla(230, 13%, 9%, 0.1),
                        0 2px 4px hsla(230, 13%, 9%, 0.2),
                        0 4px 8px hsla(230, 13%, 9%, 0.25),
                        0 6px 12px hsla(230, 13%, 9%, 0.4);
                    }
                    .parentDiv {
                        overflow: hidden;
                    }
                    .parentDiv img {
                        transition: all 0.5s ease-in-out;
                    }
                    .parentDiv:hover img {
                        height: 240px;
                        width: 240px;
                    }

                    .favButton {
                        color: white;
                        background-color: #0d6efd;
                    }
                `}
            </style>
        </>
    )
}
