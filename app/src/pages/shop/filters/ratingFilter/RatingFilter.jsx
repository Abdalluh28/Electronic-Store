import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setRating } from '../../../../redux/slices/filterSlice';

export default function RatingFilter() {

    const rating = [1, 2, 3, 4];

    const dispatch = useDispatch();
    const ratingState = useSelector((state) => state.filter.rating);
    

    const handleChooseRating = (rating) => {
        dispatch(setRating(rating))
    }

    return (
        <>
            <div className="relative mt-8 mb-4">
                <fieldset className="border border-[#3b82f6] rounded-md px-4 pb-2 pt-6">
                    <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-black px-2 text-xl text-[#3b82f6] w-fit">
                        Rating
                    </legend>
                    <div className="flex flex-col justify-center">
                        {rating.reverse().map((rating) => (
                            <div key={rating} className="w-fit p-2 rounded-xl flex items-center">
                                <input
                                    type="radio"
                                    id={rating}
                                    name='rating'
                                    value={rating}
                                    checked={ratingState === rating}
                                    onChange={() => handleChooseRating(rating)}
                                />
                                <label htmlFor={rating} className="ml-2 flex gap-1 text-lg">
                                    <div>
                                        <span>{rating}</span>
                                        <FontAwesomeIcon icon={faStar} className='text-white !text-md' />
                                    </div>
                                    <span>& above</span>
                                </label>
                            </div>

                        ))}
                    </div>
                </fieldset>

            </div>
        </>
    )
}
