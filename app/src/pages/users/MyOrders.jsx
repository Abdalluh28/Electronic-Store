import React, { useEffect } from 'react'
import Cookie from 'js-cookie'
import { useGetMyOrdersQuery } from '../../redux/features/orders/OrdersApiSlice'
import { Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function MyOrders() {

    const accessToken = Cookie.get('accessToken') ? Cookie.get('accessToken') : null
    const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null
    const { data: myOrders, isLoading } = useGetMyOrdersQuery({ accessToken, id: userInfo.id })

    useEffect(() => {
        if (myOrders) {
            console.log(myOrders)
        }
    }, [myOrders])


    return (
        <>
            {isLoading ? <Spinner /> : ''}
            {!isLoading && (
                <>
                    <h1 className="my-3 text-2xl">My Orders</h1>
                    <div className='grid grid-cols-3 gap-4 mb-3 text-xl'>
                        <div className='col-span-1'>order items</div>
                        <div className='col-span-1'>total price</div>
                        <div className='col-span-1'>status</div>
                    </div>
                    {myOrders && myOrders.map(order => (
                        <div className='grid grid-cols-3 gap-4 border-b border-gray-500 mb-3 pb-3'>

                            <div className='col-span-1 flex flex-wrap gap-2'>
                                {order.orderItems.map(item => (
                                    <div className='flex gap-2 items-center border-r pr-1'>
                                        <p>{item.qty} * </p>
                                        <img src={ item.image.includes('cloudinary') ? item.image : process.env.REACT_APP_API_URL + item.image}
                                        alt={item.name} className='w-16 h-16 object-cover rounded-lg' />
                                    </div>
                                ))}
                            </div>

                            <div className='col-span-1 flex items-center'>
                                ${order.totalPrice}
                            </div>

                            <div className='col-span-1 flex flex-wrap items-center'>
                                <div className='flex flex-wrap gap-2'>
                                    <div className={`btn ${order.isPaid ? 'btn-primary' : 'btn-warning'} h-fit cursor-default`}> {order.isPaid ? 'Paid' : 'Not Paid'} </div>
                                    <div className={`btn ${order.isDelivered ? 'btn-primary' : 'btn-danger'} h-fit cursor-default`}> {order.isDelivered ? 'Delivered' : 'Not Delivered'} </div>
                                </div>
                            </div>
                        </div>
                    ))}


                    <div className='flex flex-col gap-2 mt-4'>
                        <p className='text-xl'>Total Orders: {myOrders && myOrders.length}</p>
                        <p className='text-xl'>Total Price: ${myOrders && myOrders.reduce((acc, order) => acc + order.totalPrice, 0)}</p>
                        <p className='text-xl'>Total Items: {myOrders && myOrders.reduce((acc, order) => acc + order.orderItems.length, 0)}</p>
                        <Link to='/shop' className='text-black bg-white w-fit px-3 py-2 rounded-lg text-lg hover:!text-white hover:!bg-blue-500 transition duration-300 ease-in-out' >
                            Continue Shopping
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}
