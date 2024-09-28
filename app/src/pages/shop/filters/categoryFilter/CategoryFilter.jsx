import React, { useEffect, useState } from 'react'
import { useGetCategoriesQuery } from '../../../../redux/features/categories/categoriesApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../../../redux/slices/filterSlice';

export default function CategoryFilter() {

    const { data } = useGetCategoriesQuery();

    const dispatch = useDispatch();
    const categoryState = useSelector(state => state.filter.category);    

    
    const handleChooseCategory = (id) => {
        if (categoryState.includes(id)) {
            const updatedCategories = categoryState.filter(item => item !== id)
            dispatch(setCategory(updatedCategories))
        } else {
            dispatch(setCategory([...categoryState, id]))
        }
    }


    return (
        <>
            <div className="relative mt-8 mb-4">
                <fieldset className="border border-[#3b82f6] rounded-md px-4 pb-2 pt-6">
                    <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-black px-2 text-xl text-[#3b82f6] w-fit">
                        Category
                    </legend>
                    <div className="flex flex-col justify-center">
                        {data?.map((category) => (
                            <div key={category._id} className="w-fit p-2 rounded-xl flex items-center">
                                <input
                                    type="checkbox"
                                    checked={categoryState.includes(category._id)}
                                    id={category._id}
                                    name={category.name}
                                    value={category._id}
                                    onChange={() => handleChooseCategory(category._id)}
                                />
                                <label htmlFor={category._id} className="ml-2 text-md">
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>

            </div>
        </>
    )
}
