import React, { useEffect, useState } from 'react'
import ProductCard from '../../../components/ProductCard'
import { useGetCategoriesQuery } from '../../../redux/features/categories/categoriesApiSlice';

export default function Products({ products }) {

    const [featuredImages, setFeaturedImages] = useState([]);
    
    const { data: categories } = useGetCategoriesQuery();


    useEffect(() => {
        const fetchImagesSequentially = async () => {
            if (products) {
                const imageUrls = [];
                for (const product of products) {
                    try {
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
    }, [products])



    return (
        <>
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 my-10 lg:my-14'>
                {products.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} image={featuredImages[index]} categories={categories} />
                ))}
            </div>
        </>
    )
}
