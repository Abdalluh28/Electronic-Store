import React, { useEffect, useState } from 'react'
import { useDeleteReviewMutation, usePostReviewMutation } from '../../redux/features/products/productsApiSlice'
import Cookie from 'js-cookie'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2'

export default function Reviews({ reviews, makeStars, id, refetch, userReview, setUserReview }) {


    const [comment, setComment] = useState('')
    const [newReviewRating, setNewReviewRating] = useState(0)
    const [postReview, { isLoading: isLoadingReview }] = usePostReviewMutation()
    const [deleteReview, { isLoading: isLoadingDeleteReview }] = useDeleteReviewMutation()
    const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null
    const [reviewLength, setReviewLength] = useState(0)


    useEffect(() => {
        if (userReview) {
            setReviewLength(reviews.length + 1)
        } else {
            setReviewLength(reviews.length)
        }
    }, [reviews, userReview])


    const handleNewReview = async (e) => {
        e.preventDefault();

        if (newReviewRating < 0 || newReviewRating > 5) {
            toast.error('Rating must be between 0 and 5', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

            return
        }

        if (isLoadingReview) return;

        if (!userInfo) {
            toast.error('You must login first', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        const { data, error: err } = await postReview({ comment, rating: newReviewRating, productId: id, userId: userInfo.id })



        if (err && err.status === 403) {
            toast.error('You have already reviewed', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        if (data) {
            refetch()
            setComment('')
            setNewReviewRating(0)

            toast.success('Review Added Successfully', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }


    const handleDeleteReview = (e) => {
        e.preventDefault();
        if (isLoadingDeleteReview) return;

        if (!userInfo) {
            toast.error('You must login first', {
                position: 'top-right',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            return
        }

        Swal.fire({
            title: 'Are you sure you want to delete this review?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data } = await deleteReview({ productId: id, userId: userInfo.id })
                if (data) {
                    refetch()
                    setUserReview(null)
                    toast.success('Review Deleted Successfully', {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            }
        })


    }



    return (
        <div className='mt-20'>
            <h1 className='text-2xl font-bold mt-2 mb-6 flex gap-2'>
                <span>Reviews</span>
                <span>({reviewLength})</span>
            </h1>


            <div className={`flex lg:items-center items-start lg:flex-row ${userReview ? 'flex-col-reverse' : 'flex-col'}`}>


                <div className='lg:w-1/2 w-full flex flex-col gap-4'>
                    {reviews.length === 0 && <p className='text-xl'>No reviews yet</p>}
                    {reviews.length > 0 && <h1 className='text-xl'>{userReview ? 'Other Reviews' : 'Rating & Reviews'}</h1>}
                    {reviews?.map((review, index) => {
                        return (
                            <div className='flex gap-2 items-center'>
                                <div className='w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-medium'>
                                    {review.name.slice(0, 1)}
                                </div>
                                <div className='flex gap-2 flex-col'>
                                    <p className='text-lg'>{makeStars(review.rating)}</p>
                                    <div className='flex gap-2'>
                                        <p className='text-lg font-normal'>{review.name}</p>
                                        <p className='text-lg text-gray-500'>{review.createdAt.slice(0, 10)}</p>
                                    </div>
                                    <p className='text-lg text-gray-400'>{review.comment}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>


                {!userReview && (
                    <div className='lg:w-1/2 w-full '>
                        <h1 className='text-xl mb-2'>Write a Review</h1>
                        <div >

                            <div className='mb-2'>
                                <label className='text-lg'>Rating</label>
                                <input type="number" className='w-full bg-black border border-gray-300 p-2 rounded-lg'
                                    value={newReviewRating} onChange={(e) => setNewReviewRating(e.target.value)} />
                            </div>

                            <div className='mb-2'>
                                <label className='text-lg'>Comment</label>
                                <textarea
                                    className='w-full bg-black border border-gray-300 p-2 rounded-lg'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />

                            </div>

                            <button
                                type="submit"
                                className='bg-[#0d6efd] mb-2 px-4 py-2 rounded-lg text-xl hover:bg-blue-700 transition duration-300 ease-in-out'
                                onClick={handleNewReview}
                            >
                                {isLoadingReview ? <Spinner animation="border" /> : 'Submit'}
                            </button>

                        </div>
                    </div>
                )}


                {userReview && (
                    <div className='lg:w-1/2 w-full self-start mb-5'>
                        <h1 className='text-xl'>Your Review</h1>
                        <div className='flex gap-2 items-center mt-3 flex-wrap'>
                            <div className='w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-medium'>
                                {userReview.name.slice(0, 1)}
                            </div>
                            <div className='flex gap-2 flex-col'>
                                <p className='text-lg'>{makeStars(userReview.rating)}</p>
                                <div className='flex gap-2'>
                                    <p className='text-lg font-normal'>{userReview.name}</p>
                                    <p className='text-lg text-gray-500'>{userReview.createdAt.slice(0, 10)}</p>
                                </div>
                                <p className='text-lg text-gray-400'>{userReview.comment}</p>
                            </div>

                            <div className='sm:w-fit w-full'>
                                <button
                                    type="submit"
                                    className='bg-red-500 ml-4 px-4 py-2 rounded-lg text-xl hover:bg-red-700 transition duration-300 ease-in-out'
                                    onClick={handleDeleteReview}
                                >
                                    {isLoadingDeleteReview ? <Spinner animation="border" /> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}
