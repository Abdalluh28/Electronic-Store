import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSortBy } from '../../../../redux/slices/filterSlice';

export default function SortByFilter() {

    const sortBy = ['Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A'];
    const sortByDBNames = ['lowest', 'highest', 'a-z', 'z-a'];
    

    const dispatch = useDispatch();
    const sortByValue = useSelector((state) => state.filter.sortBy);


    const handleSortByChange = (value) => {
        dispatch(setSortBy(value))
    }


    return (
        <>
            <div className="relative mt-8 mb-4">
                <fieldset className="border border-[#3b82f6] rounded-md px-4 pb-2 pt-6">
                    <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-black px-2 text-xl text-[#3b82f6] w-fit">
                        Sort By
                    </legend>
                    <div className="flex flex-col justify-center">
                        {sortBy.map((item, index) => (
                            <div key={item} className="w-fit p-2 rounded-xl flex items-center">
                                <input
                                    type="radio"
                                    checked={sortByValue === sortByDBNames[index]}
                                    id={item}
                                    name='sortBy'
                                    value={item}
                                    onChange={() => handleSortByChange(sortByDBNames[index])}
                                />
                                <label htmlFor={item} className="ml-2 flex gap-1 text-lg">
                                    {item}
                                </label>
                            </div>

                        ))}
                    </div>
                </fieldset>

            </div>
        </>
    )
}
