import React from 'react'
import PriceRange from './priceRange/PriceRange';
import CategoryFilter from './categoryFilter/CategoryFilter';
import RatingFilter from './ratingFilter/RatingFilter';
import SortByFilter from './sort/SortByFilter';
import { useDispatch } from 'react-redux';
import { clearFilter } from '../../../redux/slices/filterSlice';

export default function Fiters() {

    const dispatch = useDispatch();

    const handleClearFilters = () => {
        dispatch(clearFilter())
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex justify-between items-center'>
                    <span className='text-xl'>Filters</span>
                    <button className='btn btn-danger' onClick={handleClearFilters}>Clear Filters</button>
                </div>

                {/* price range */}
                <PriceRange />
                <CategoryFilter />
                <RatingFilter />
                <SortByFilter />
                
            </div>
        </>
    )
}
