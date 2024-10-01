import React, { useEffect, useState } from 'react'
import { useGetProductsByCategoryQuery } from '../redux/features/products/productsApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../redux/slices/filterSlice';

export default function HomeCategories() {

    const { data: productsByCategory, isLoading, error } = useGetProductsByCategoryQuery();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImagesSequentially = async () => {
            if (productsByCategory) {
                const imageUrls = [];

                for (const product of productsByCategory.products) {
                    try {
                        if (product.images[0].includes('cloudinary')) {
                            const imageUrl = product.images[0];
                            imageUrls.push(imageUrl);
                            continue;
                        }
                        const imageUrl = `${process.env.REACT_APP_API_URL}${product.images[0]}`
                        imageUrls.push(imageUrl);
                    } catch (error) {
                        console.error('Error fetching image:', error);
                        imageUrls.push(''); // Handle fetch error or provide a fallback
                    }
                }

                setImages(imageUrls);
            }
        };

        fetchImagesSequentially();
    }, [isLoading]); // Update dependency to include productsByCategory


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const categoryState = useSelector(state => state.filter.category);    

    
    const handleClickCategory = (id) => {
        dispatch(setCategory([id]));

        navigate(`/shop`);
    }


    return (
        <>
            <h1 className='text-3xl font-bold my-4'>Categories</h1>

            {isLoading && (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}

            {!isLoading && (
                <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
                    {productsByCategory && productsByCategory.products.map((product, index) => (
                        <div
                            key={product._id}
                            className='bg-cover bg-center h-60 flex flex-col justify-center items-center cursor-pointer'
                            style={{
                                backgroundImage: `url(${images[index]})`,
                                backgroundSize: '90% 90%',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Add a background color with alpha for blending
                                backgroundBlendMode: 'darken',
                                overflow: 'hidden',
                            }}
                        >
                            <h3 className='text-white text-2xl m-3'>{productsByCategory.categories[index].name}</h3>
                            <button className='btn btn-primary'
                            onClick={() => handleClickCategory(productsByCategory.categories[index]._id)}>View Products</button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
