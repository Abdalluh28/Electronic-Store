import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux/features/products/productsApiSlice';
import Offcanves from './Offcanves';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Products from './products/Products';
import { Button, Pagination, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setMaxPrice, setMinPrice } from '../../redux/slices/filterSlice';

export default function Shop() {
    const [pageCounter, setPageCounter] = useState(1);
    const [maxPageNumber, setMaxPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    const minPrice = useSelector((state) => state.filter.minPrice);
    const maxPrice = useSelector((state) => state.filter.maxPrice);
    const category = useSelector((state) => state.filter.category);
    const rating = useSelector((state) => state.filter.rating);
    const sortBy = useSelector((state) => state.filter.sortBy);
    const dispatch = useDispatch();
    const { data, isLoading, isSuccess } = useGetProductsQuery({ page: pageCounter, keyword, minPrice, maxPrice, category, rating, sortBy });
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [allProducts, setAllProducts] = useState ([]);

    useEffect(() => {
        setPageCounter(1);
    },[minPrice, maxPrice, category, rating, sortBy])

    useEffect(() => {
        if (data) {
            setFilteredProducts(data.products);
            setMaxPageNumber(data.pages); // Update max pages based on search results
            setAllProducts(data.allProducts);
        }
    }, [data]);

    const state = useSelector((state) => state);
    useEffect(() => {
        console.log(state)
    })

    // reset the price range after navigating to another page 
    const location = useLocation();
    useEffect(() => {
        return () => {
            resetPrice();
        }
    },[location])
    
    const resetPrice = () => {
        dispatch(setMaxPrice(5000));
        dispatch(setMinPrice(0));
    }

    const debounceSearch = (cb, delay) => {
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                cb(...args);
            }, delay);
        };
    };

    const handleSearch = debounceSearch((event) => {
        const value = event.target.value;
        setKeyword(value);
        setPageCounter(1); // Reset to first page on new search
    }, 500);

    // Pagination items
    const items = [];
    for (let number = 1; number <= maxPageNumber; number++) {
        items.push(
            <Pagination.Item key={number} active={number === pageCounter} onClick={() => setPageCounter(number)}>
                {number}
            </Pagination.Item>
        );
    }


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <h1 className='text-2xl font-bold my-2'>Shop</h1>
            <div className='text-sm flex gap-2 text-gray-400 mb-2'>
                <Link to={"/"} className='hover:text-blue-500 transition-all duration-300 ease-in-out'>Home</Link>
                <span>&gt; Shop</span>
            </div>

            <Offcanves show={show} handleClose={handleClose} handleShow={handleShow} />
            <div className='flex sm:items-center justify-between sm:flex-row flex-col-reverse w-full'>
                <div className='flex gap-1 text-3xl sm:mt-0 mt-3'>
                    <span>{allProducts?.length > 0 ? allProducts?.length : 0}</span> {/* Display filtered products count */}
                    <span>Products Found</span>
                </div>
                <div className='flex gap-2'>
                    <button onClick={handleShow} className='bg-[#0d6efd] lg:block hidden px-4 py-2 rounded-lg text-xl hover:bg-blue-700 transition duration-300 ease-in-out' >
                        Filters
                    </button>
                    <div className='relative flex me-4'>
                        <input id='search'
                            className="form-control my-2 w-full rounded-lg z-0 pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                        />
                        <label htmlFor='search' className='absolute left-1 top-2 text-black text-2xl bg-transparent z-20 p-1'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </label>
                    </div>
                </div>
            </div>

            {/* Products */}
            {isLoading && <Spinner animation="border" role="status" />}
            {!isLoading && isSuccess && <Products products={filteredProducts} />}

            {/* Pagination */}
            {isSuccess && maxPageNumber > 1 && (
                <div className='flex justify-center mt-5'>
                    <Pagination>
                        <Pagination.Prev onClick={() => setPageCounter((prev) => Math.max(prev - 1, 1))} />
                        {items}
                        <Pagination.Next onClick={() => {
                            if (pageCounter < maxPageNumber) {
                                setPageCounter((prev) => prev + 1);
                            }
                        }} />
                    </Pagination>
                </div>
            )}
        </>
    );
}
