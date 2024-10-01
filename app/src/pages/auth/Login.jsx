import React, { useEffect, useState } from 'react'
import { useLoginMutation, useSendVerificationEmailMutation } from '../../redux/features/auth/authApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import imgOne from '../../assets/img.avif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { updateCartAfterLogin } from '../../redux/slices/cartSlice'
import { updateFavouriteAfterLogin } from '../../redux/slices/favouriteSlice'

export default function Login() {


    const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : ''
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : ''

    const cartItems = useSelector((state) => state.cart.cartItems);
    const totalPrice = useSelector((state) => state.cart.total);
    const cartTotalQuantity = useSelector((state) => state.cart.quantity);
    const favouriteItems = useSelector((state) => state.favourite.favouriteItems);
    const favouriteTotalQuantity = useSelector((state) => state.favourite.quantity);
    const [cart, setCart] = useState({})
    const [favourite, setFavourite] = useState({})
    const dispatch = useDispatch();

    useEffect(() => {
        if (cartItems) {
            setCart({
                items: cartItems,
                totalPrice,
                cartTotalQuantity
            })
        }

        if (favouriteItems) {
            setFavourite({
                items: favouriteItems,
                favouriteTotalQuantity
            })
        }

    }, [cartItems, favouriteItems])


    const [userInputs, setUserInputs] = useState({
        email: "",
        password: ""
    })

    const [login, { isLoading }] = useLoginMutation()
    const [sendVerificationEmail, { isLoading: isLoadingEmail }] = useSendVerificationEmailMutation()

    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && userInfo.isVerified) {
            navigate('/')
        }
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error: err } = await login({
                email: userInputs.email,
                password: userInputs.password,
                cart,
                favourite: favouriteItems
            })

            if (err && err.status === 404) {
                toast.error('User does not exist', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            } else if (err && err.status === 401) {
                toast.error('Email is not verified', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            } else if (err && err.status === 402) {
                toast.error('Password is wrong', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            }

            const { isVerified } = data
            if (!isVerified) {
                toast.error('Email is not verified', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            }

            const accessToken = data?.accessToken;
            const refreshToken = data?.refreshToken;
            if (accessToken) {
                const expiryDate = new Date()
                expiryDate.setMinutes(expiryDate.getMinutes() + 15)
                Cookies.set('accessToken', accessToken, { expires: expiryDate })
                const userInfo = {
                    email: data?.email,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    isVerified: data?.isVerified,
                    id: data?.id
                }
                expiryDate.setDate(expiryDate.getDate() + 7)
                Cookies.set('userInfo', JSON.stringify(userInfo), { expires: expiryDate })
                Cookies.set('jwt', refreshToken, { expires: expiryDate })

                setUserInputs({
                    email: '', password: "",
                })


                // update cart
                const items = data?.items.map((item) => {
                    return {
                        ...item,
                        image: item.image.includes('cloudinary') ? `${item.image}` : `${process.env.REACT_APP_API_URL}${item.image}`,
                    }
                })
                dispatch(updateCartAfterLogin({ cartItems: items, totalPrice: data?.totalPrice, totalQuantity: data?.totalQuantity }));


                // update favourite
                const favouriteItems = data?.favouriteItems.map((item) => {
                    return {
                        ...item,
                        image: item.image.includes('cloudinary') ? `${item.image}` : `${process.env.REACT_APP_API_URL}${item.image}`,
                    }
                })
                dispatch(updateFavouriteAfterLogin({ favouriteItems: favouriteItems, favouriteTotalQuantity: data?.favouriteTotalQuantity }));


                toast.success('Successfully logged in', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => navigate('/'),
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const eyeSlash = () => {
        document.querySelector('.eyeSlash').style.display = 'none'
        document.querySelector('.eyeShow').style.display = 'block'
        document.querySelector('#password').setAttribute('type', 'text')
    }

    const eyeShow = () => {
        document.querySelector('.eyeShow').style.display = 'none'
        document.querySelector('.eyeSlash').style.display = 'block'
        document.querySelector('#password').setAttribute('type', 'password')
    }


    const handleVerifyEmail = async () => {

        if (!userInputs.email) {
            toast.error('Email is required', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        const { data, error: err } = await sendVerificationEmail({
            email: userInputs.email,
            accessToken
        })

        if (err && err.status === 404) {
            toast.error('User does not exist', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            return
        }


        if (data) {
            const accessToken = data?.accessToken
            const refreshToken = data?.refreshToken
            if (accessToken) {

                const expiryDate = new Date()
                expiryDate.setMinutes(expiryDate.getMinutes() + 15)
                Cookies.set('accessToken', accessToken, { expires: expiryDate })
                const userInfo = {
                    email: data?.email,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    isVerified: data?.isVerified,
                    id: data?.id
                }
                expiryDate.setDate(expiryDate.getDate() + 7)
                Cookies.set('userInfo', JSON.stringify(userInfo), { expires: expiryDate })
                Cookies.set('jwt', refreshToken, { expires: expiryDate })

                toast.success('Please check your email to activate your account', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        }
    }

    return (
        <div className='w-full grid lg:grid-cols-2 grid-cols-1 h-[95%]'>
            <div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <h4 className='text-3xl font-bold'>Sign In</h4>
                    <div className='flex flex-col gap-1'>
                        <label className='' htmlFor='email'>Email Address</label>
                        <input required className='border-1 rounded-xl w-75 bg-black' type="email" name="email" id="email" value={userInputs.email}
                            onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })} />
                    </div>
                    <div className='flex flex-col gap-1 mt-2'>
                        <label className='' htmlFor='password'>Password</label>
                        <div className='flex flex-col w-75'>
                            <input required className='border-1 rounded-xl bg-black' type="password" name="password" id="password" value={userInputs.password}
                                onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
                                onCopy={(e) => e.preventDefault()} />
                            <FontAwesomeIcon icon={faEyeSlash} className='self-end -translate-y-9 -translate-x-1 cursor-pointer text-lg p-1 -mb-5 eyeSlash'
                                onClick={eyeSlash} />
                            <FontAwesomeIcon icon={faEye} className='self-end -translate-y-9 -translate-x-1 cursor-pointer text-lg p-1 -mb-5 hidden eyeShow'
                                onClick={eyeShow} />
                            <Link to='/password/forgot' className='w-fit ms-auto underline text-white p-2 rounded-lg mt-1 underline-offset-8 ' >Forgot Password</Link>
                        </div>
                    </div>
                    <div className='flex w-75 justify-between'>
                        <button className='w-1/3 text-white btn btn-outline-primary p-2 rounded-lg' type='submit'>
                            {isLoading ? <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner> : 'Sign In'}
                        </button>
                        <button className='w-1/3 text-white btn btn-outline-primary p-2 rounded-lg' type='button'
                            onClick={handleVerifyEmail}>
                            {isLoadingEmail ? <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner> : 'Verify Email'}
                        </button>
                    </div>
                </form>


                <div className='flex gap-2 mt-3'>
                    <span>Don't have an account ?</span>
                    <Link to='/auth/register' className='w-fit underline rounded-lg underline-offset-8 text-blue-400'>Register</Link>
                </div>
            </div>
            <img alt='image' className=' max-h-full h-full rounded-lg lg:block hidden' src={imgOne} />
        </div>
    )
}
