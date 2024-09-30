import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useGetRelatedProductsQuery, useGetSingleProductQuery, usePostReviewMutation } from '../../redux/features/products/productsApiSlice'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faMinus, faPlus, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { addItemToCart } from '../../redux/slices/cartSlice'
import { toast } from 'react-toastify'
import { addItemToFavourite } from '../../redux/slices/favouriteSlice'
import { Spinner } from 'react-bootstrap'
import ProductCard from '../../components/ProductCard'
import { useGetCategoriesQuery } from '../../redux/features/categories/categoriesApiSlice'
import Reviews from './Reviews'
import Cookie from 'js-cookie'
import gsap from 'gsap';
import { setCategory } from '../../redux/slices/filterSlice'


export default function SingleProduct() {

    const { id } = useParams()
    const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null

    const { data, isLoading, refetch } = useGetSingleProductQuery({ id, userId: userInfo?.id })
    const { data: relatedProducts, isLoading: isLoadingRelated } = useGetRelatedProductsQuery(id)
    const { data: categories } = useGetCategoriesQuery();
    const [images, setImages] = useState([])
    const [borderImage, setBorderImage] = useState(0)
    const [imagesToShow, setImagesToShow] = useState([])
    const [rating, setRating] = useState(0)
    const [ratingStars, setRatingStars] = useState([])
    const [desc, setDesc] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [isFavourite, setIsFavourite] = useState(false)
    const [reviews, setReviews] = useState([])
    const [userReview, setUserReview] = useState('')
    const cartItems = useSelector((state) => state.cart.cartItems);
    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (data) {
            setImages(data?.product?.images.map((image) => `${process.env.REACT_APP_API_URL}${image}`))
            setImagesToShow(data?.product?.images.map((image) => `${process.env.REACT_APP_API_URL}${image}`))
            setBorderImage(`${process.env.REACT_APP_API_URL}${data?.product?.images[0]}`)

            const num = Math.round(data?.product?.rating * 2) / 2;
            setRating(num)

            setDesc(data?.product?.description.slice(0, 100))

            setReviews(data?.product?.reviews)

            if (data?.review) {
                setUserReview(data?.review)
                setReviews(data?.product?.reviews.filter((review) => review._id !== data?.review._id))
            }
        }
    }, [data])




    const handleImageChange = (image) => {
        const mainImage = document.getElementById('mainImage');
        const index = images.indexOf(image);
        console.log(index)
        if (image === mainImage.src) return;
        // swap this image with the main image

        const flag = images[index];
        images[index] = mainImage.src;
        images[0] = flag;
        mainImage.src = image;
        setImages(images);
        setBorderImage(image);
        gsap.fromTo(mainImage, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.out' });
    }


    const handleClickCategory = (id) => {
        dispatch(setCategory([id]));

        navigate(`/shop`);
    }


    useEffect(() => {
        if (relatedProducts) {
            console.log(relatedProducts.products)
        }
    }, [relatedProducts])


    useEffect(() => {
        const stars = makeStars(rating);

        setRatingStars(stars);
    }, [rating])

    const makeStars = (rating) => {
        const stars = [];
        const fullStar = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStar = 5 - Math.ceil(rating);

        for (let i = 0; i < fullStar; i++) {
            stars.push(<i key={i} className="fa-solid fa-star text-yellow-400"></i>);
        }

        if (halfStar) {
            stars.push(<i key={fullStar} className="fa-solid fa-star-half-stroke text-yellow-400"></i>);
        }

        for (let i = 0; i < emptyStar; i++) {
            stars.push(<i key={fullStar + i + 1} className="fa-regular fa-star text-yellow-400"></i>);
        }

        return stars
    }


    const handleDesc = () => {
        if (desc.length < 101) {
            setDesc(data?.product?.description)
        } else {
            setDesc(data?.product?.description.slice(0, 100))
        }
    }


    const handleAddToCart = (value) => {
        if (value < 1) return;
        let item = cartItems.find((item) => item.id === id);
        if (!item) {
            item = {
                id: id,
                name: data?.product?.name,
                image: images[0],
                price: data?.product?.price,
                quantity: value,
                totalPrice: data?.product?.price * value
            }
            dispatch(addItemToCart(item));
        } else {
            dispatch(addItemToCart({ ...item, quantity: value, price: item.price }));
        }

        toast.success('Added to cart', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    useEffect(() => {
        const existingItem = favouriteItems.find((item) => item.id === id);
        if (existingItem) setIsFavourite(true)
    }, [favouriteItems])
    const handleAddToFavourite = () => {
        const existingItem = favouriteItems.find((item) => item.id === id);
        if (existingItem) return
        dispatch(addItemToFavourite({
            id: id,
            name: data?.product?.name,
            image: images[0],
            price: data?.product?.price
        }))

        toast.success('Added to favourite', {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })

        setIsFavourite(true)
    }

    return (
        <>
            <div className='text-sm flex gap-2 text-gray-400 mb-2'>
                <Link to={"/"} className='hover:text-blue-500 transition-all duration-300 ease-in-out'>Home</Link>
                <span>&gt; {data?.product?.name}</span>
            </div>

            {data ? (
                <>
                    <div className='grid lg:grid-cols-2 grid-cols-1 mt-4'>
                        <div className='flex justify-center items-center 2xl:mr-0 mr-4 '>
                            <div className='w-1/3 flex flex-col gap-3'>
                                {/* side images */}
                                {imagesToShow.map((image) => (
                                    <img key={image} src={image} className={`w-24 h-24 rounded-lg cursor-pointer ${image === borderImage ? 'border-[3px] border-red-500' : ''}`}
                                        onClick={() => handleImageChange(image)} id={image} />
                                ))}
                            </div>
                            <div className='w-2/3 sm:ml-0 ml-4'>
                                {/* main image */}
                                <img src={images[0]} className='w-96 h-96 rounded-lg' id='mainImage' />
                            </div>
                        </div>

                        <div className='flex flex-col gap-2 lg:mt-0 mt-4'>
                            <button className='text-gray-500 w-fit pr-2 py-1 hover:text-gray-400 transition-all duration-300 ease-in-out'
                                onClick={() => handleClickCategory(data?.product?.category)} >{data?.category}</button>
                            <h1 className='text-2xl font-bold'>{data?.product?.name}</h1>

                            <div className='flex text-lg'>
                                <span>{ratingStars} </span>
                                <span className='text-gray-400'>({data?.product?.numReviews} reviews)</span>
                            </div>

                            <div className='mt-2'>
                                {desc} {desc.length < 101 ?
                                    desc.length === data?.product?.description.length ? '' : '...'
                                    : ''}
                                <button className='text-blue-500' onClick={() => handleDesc()}>
                                    {desc.length < 101 ?
                                        desc.length === data?.product?.description.length ? '' : 'Read More'
                                        : 'Show Less'}
                                </button>
                            </div>

                            <div>
                                <p className='text-xl my-2'>Price: ${data?.product?.price}</p>
                            </div>

                            <div className=''>
                                <p className='text-xl'>Quantity:</p>
                                <div className='flex  justify-center items-center'>
                                    <div className='w-1/3'>
                                        <div className='w-fit  p-2 rounded-xl flex items-center'>
                                            <FontAwesomeIcon className='text-lg cursor-pointer hover:text-red-400 p-2' icon={faMinus}
                                                onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} />
                                            <input type="number" className='xl:w-24 w-16 text-center bg-transparent border-0' value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                            />
                                            <FontAwesomeIcon className='text-lg cursor-pointer hover:text-red-400 p-2' icon={faPlus}
                                                onClick={() => setQuantity(prev => prev + 1)} />
                                        </div>
                                    </div>
                                    <div className='w-2/3'>
                                        <button
                                            onClick={() => handleAddToCart(quantity)}
                                            className='bg-blue-500 text-white hover:bg-blue-600 w-full p-2 rounded-md text-xl text-center'>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <button className=' bg-red-500 text-white hover:bg-red-600 w-2/3 p-2  rounded-md text-xl text-center'
                                        onClick={() => handleAddToFavourite()}
                                        disabled={isFavourite}
                                    >
                                        {isFavourite ? 'Added to Favourite' : 'Add to Favourite'}
                                    </button>
                                </div>
                            </div>

                            <div className='flex gap-1 text-lg'>
                                <p>Brand: </p>
                                <p>{data?.product?.brand}</p>
                            </div>
                            <div className='flex gap-1 text-lg items-center'>
                                <FontAwesomeIcon icon={faCircleCheck} />
                                <p className='text-gray-400'>30 days easy return</p>
                            </div>
                        </div>
                    </div>


                    <div className='mt-20'>
                        <h1 className='text-2xl font-bold mt-2 mb-6'>Related Products</h1>
                        {isLoadingRelated && <Spinner animation="border" role="status" />}
                        {!isLoadingRelated && (
                            <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 '>
                                {relatedProducts?.products?.map((product, index) => (
                                    <ProductCard key={product._id} product={product} index={index}
                                        image={`${process.env.REACT_APP_API_URL}${product.images[0]}`}
                                        categories={categories} />
                                ))}
                            </div>
                        )}
                    </div>


                    <Reviews reviews={reviews} makeStars={makeStars} id={id} refetch={refetch} userReview={userReview} setUserReview={setUserReview} />
                </>
            ) :
                <Spinner animation="border" role="status" />}
        </>
    )
}
