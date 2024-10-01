import React, { useEffect, useState } from 'react';
import { useGetNewProductsQuery, useGetTopProductsQuery } from '../redux/features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../redux/features/categories/categoriesApiSlice';
import { Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ active }) {
    const { data: newProducts, isLoading: newProductsLoading, isSuccess: newProductsSuccess } = useGetNewProductsQuery();
    const { data: topProducts, isLoading: topProductsLoading, isSuccess: topProductsSuccess } = useGetTopProductsQuery();
    const { data: categories } = useGetCategoriesQuery();

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featuredImages, setFeaturedImages] = useState([]);

    useEffect(() => {
        if (newProductsSuccess && topProductsSuccess) {
            if (active === 0) {
                setProducts(newProducts.products);
            } else if (active === 1) {
                setProducts(topProducts.products);
            }

            setIsLoading(false);
        }
    }, [newProductsLoading, topProductsLoading, active]);

    useEffect(() => {
        const fetchImagesSequentially = async () => {
            if (products) {
                const imageUrls = [];
                for (const product of products) {
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
                setFeaturedImages(imageUrls);
            }
        };

        fetchImagesSequentially();
    }, [products]);


    return (
        <>
            {isLoading && (
                <>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </>
            )}
            {!isLoading && (
                <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-10 lg:mt-14'>
                    {products &&
                        products.map((product, index) => (
                            <ProductCard key={index} product={product} index={index} image={featuredImages[index]} categories={categories} />
                        ))}
                </div>
            )}

        </>
    );
}
