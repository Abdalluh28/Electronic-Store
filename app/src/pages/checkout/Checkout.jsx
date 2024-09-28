import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, CardElement } from '@stripe/react-stripe-js';
import { useCreateOrderMutation, useProcessPaymentMutation } from '../../redux/features/orders/OrdersApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import { toast } from 'react-toastify';
import { clearCart } from '../../redux/slices/cartSlice';
import { useClearCartDBMutation } from '../../redux/features/cart/cartApiSlice';
import { useNavigate } from 'react-router';
import { Spinner } from 'react-bootstrap';
import Cookie from 'js-cookie';

export default function CustomCheckout() {
    const stripe = useStripe();
    const elements = useElements();
    const [userInputs, setUserInputs] = useState({
        name: '',
        email: '',
        phone: '',
        zipCode: '',
        shippingAddress: {
            address: '',
            city: '',
            postalCode: '',
            country: '',
        },
        shipping: 0,
        paymentMethod: '',
        orderNotes: ''
    })
    const [processPayment, { isLoading }] = useProcessPaymentMutation();
    const [createOrder, { isLoading: orderIsLoading }] = useCreateOrderMutation();

    const cartItmes = useSelector(state => state.cart.cartItems)
    const dispatch = useDispatch()

    const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null
    const accessToken = Cookie.get('accessToken') ? Cookie.get('accessToken') : null

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        console.log(userInputs)
        if (!userInputs.name || !userInputs.email || !userInputs.phone || !userInputs.zipCode || !userInputs.address || !userInputs.city || !userInputs.postalCode || !userInputs.country) {
            toast.error('Please fill in all required fields', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return
        }

        if (userInputs.shipping === 0) {
            toast.error('Please select a shipping option', {
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

        if (!userInputs.paymentMethod) {
            toast.error('Please select a payment method', {
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




        // Always use the predefined test card number
        const cardNumberElement = elements.getElement(CardNumberElement);
        const testCardNumber = '4242424242424242'; // Fixed test card number

        // Call the API to process the payment
        const { error, data } = await processPayment({
            amount: 1000, // Amount in cents
            cardNumber: testCardNumber,
        });



        if (error) {
            toast.error(error.message, {
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

        console.log(userInfo.id)
        const orderItems = cartItmes.map(item => {
            return {
                product: item.id,
                qty: item.quantity,
            }
        })

        const { data: order, error: orderError } = await createOrder({
            orderItems,
            shippingAddress: {
                address: userInputs.address,
                city: userInputs.city,
                postalCode: userInputs.postalCode,
                country: userInputs.country
            },
            paymentMethod: userInputs.paymentMethod,
            user: userInfo.id,
            shippingPrice: userInputs.shipping,
            orderNotes: userInputs.orderNotes,
            accessToken
        })

        console.log(orderError)

        if (order) {
            toast.success('Order created successfully', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => {
                    handleOrderSuccess()
                }
            })
        }

    };


    const [clearCartDB] = useClearCartDBMutation();
    const navigate = useNavigate();
    const handleOrderSuccess = async () => {
        dispatch(clearCart());
        await clearCartDB({ id: userInfo.id });
        navigate('/');
    }

    const cardStyle = {
        style: {
            base: {
                color: 'white',  // Text color
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: 'white',  // Placeholder text color
                },
            },
            invalid: {
                color: 'white',
                iconColor: 'white',
            },
        },
    };

    const handleShowCardElement = (num) => {
        const cardElement = document.querySelector('.cardElement');
        if (num === 1) {
            cardElement.classList.remove('hidden');
            userInputs.paymentMethod = 'card';
        } else {
            cardElement.classList.add('hidden');
            userInputs.paymentMethod = 'cash';
        }

        gsap.fromTo(cardElement, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }

    return (
        <>
            <div className='flex flex-col lg:flex-row gap-4 items-center lg:items-start'>
                <div className='lg:w-1/2 w-full flex flex-col gap-2 '>
                    {/* inputs here */}
                    {['name', 'phone', 'email', 'zipCode', 'address', 'city', 'postalCode', 'country'].map((input) => (
                        <>
                            <label htmlFor={input}>{input}</label>
                            <input
                                key={input} id={input} required
                                type={input === 'email' ? 'email' : input === 'phone' ? 'number' : 'text'}
                                value={userInputs[input]}
                                className='bg-black text-white rounded-lg'
                                onChange={(e) => setUserInputs({ ...userInputs, [input]: e.target.value })}
                            />
                        </>
                    ))}

                    <label htmlFor='order-notes'>Order notes (optional)</label>
                    <textarea className='bg-black text-white rounded-lg' id='order-notes'
                        rows={5} placeholder='Add any notes about your order' 
                        value={userInputs.orderNotes} onChange={(e) => setUserInputs({ ...userInputs, orderNotes: e.target.value })} />
                </div>
                <div className='lg:w-1/2 w-full flex items-center justify-center'>
                    {/* order details */}
                    <div className='flex flex-col w-[90%]'>
                        <h1 className='text-3xl font-bold mb-3'>Order Details</h1>

                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between border-b border-gray-500 pb-2'>
                                <p>Product</p>
                                <p>Quantity</p>
                                <p>Total</p>
                            </div>
                            {cartItmes.map(item => (
                                <div key={item._id} className='flex justify-between border-b border-gray-500 pb-2'>
                                    <p className='w-1/2'>{item.name}</p>
                                    <p className='w-1/4'>{item.quantity}</p>
                                    <p className='w-1/4 flex justify-end'>${item.price}</p>
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-between mt-3 items-center border-b border-gray-500 pb-2'>
                            <p>Shipping</p>
                            <div>
                                <div className='flex justify-center items-center'>
                                    <label htmlFor='today'>Delivery: Today Cost: <span className='text-gray-300 mr-1'>$60.00</span> </label>
                                    <input type="radio" name='shipping' required id='today'
                                        onClick={() => setUserInputs({ ...userInputs, shipping: 60 })} />
                                </div>
                                <div className='flex justify-center items-center'>
                                    <label htmlFor='sevenDays'>Delivery: 7 Days Cost: <span className='text-gray-300 mr-1'>$20.00</span></label>
                                    <input type="radio" name='shipping' required id='sevenDays'
                                        onClick={() => setUserInputs({ ...userInputs, shipping: 20 })} />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between mt-3 items-center border-b border-gray-500 pb-2'>
                            <p>Total</p>
                            <p>${cartItmes.reduce((acc, item) => acc + item.price * item.quantity, 0) + userInputs.shipping}</p>
                        </div>

                        {/* <CardElement options={cardStyle} className='text-white' /> */}
                        <div className='flex flex-col mt-3 border-b border-gray-500 pb-2'>
                            <div className='flex gap-1 items-center mb-2 flex-wrap'>
                                <input id="card-element" name='credit' required type='radio'
                                    onClick={() => handleShowCardElement(1)} />
                                <label htmlFor="card-element">Credit card</label>
                                <div className='w-full my-1 hidden cardElement'>
                                    <CardElement options={cardStyle} className='text-white' />
                                </div>
                            </div>
                            <div className='flex gap-1 items-center mb-2'>
                                <input id="cash" name='credit' required type='radio'
                                    onClick={() => handleShowCardElement(0)} />
                                <label htmlFor="cash">Cash on delivery</label>
                            </div>
                        </div>

                        <button
                            className='w-full bg-blue-500 text-white hover:bg-blue-700 transition duration-300 ease-in-out rounded-lg py-2 mt-3'
                            type='submit'
                            onClick={handleCheckout}
                        >
                            {isLoading || orderIsLoading ? <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner> : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}


