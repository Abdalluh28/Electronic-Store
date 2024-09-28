const { apiSlice } = require('../../api/apiSlice')



const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({keyword, page, category, minPrice, maxPrice, sortBy,rating}) => ({
                url: '/products',
                method: 'GET',
                params: {
                    keyword,
                    page,
                    category, minPrice, maxPrice, sortBy,rating
                }
            }),
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: '/products/allProducts',
                method: 'GET',
            }),
        }),
        getSingleProduct: builder.query({
            query: ({id, userId}) => ({
                url: `/products/${id}`,
                method: 'GET',
                params: {
                    userId,
                }
            }),
        }),

        createProduct: builder.mutation({
            query: ({formData, accessToken}) => ({
                url: "/products",
                method: "POST",
                body: formData,
                Headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': `Bearer ${accessToken}`
                }
            })
        }),

        updateProduct: builder.mutation({
            query: ({ id, formData, accessToken }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: formData,
                Headers: {
                    "Content-Type": "multipart/form-data",
                    'authorization': `Bearer ${accessToken}`
                }
            }),
        }),

        deleteProduct: builder.mutation({
            query: ({id, accessToken}) => ({
                url: `/products/${id}`,
                method: "DELETE",
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            }),
        }),


        getTopProducts: builder.query({
            query: () => ({
                url: '/products/top',
                method: 'GET',
            }),
        }),

        getNewProducts: builder.query({
            query: () => ({
                url: '/products/new',
                method: 'GET',
            }),
        }),

        postReview: builder.mutation({
            query: (data) => ({
                url: `/products/${data.productId}/reviews`,
                method: 'POST',
                body: data
            }),
        }),

        deleteReview: builder.mutation({
            query: (data) => ({
                url: `/products/${data.productId}/deleteReview`,
                method: 'DELETE',
                body: data
            }),
        }),


        getProductsByCategory: builder.query({
            query: () => ({
                url: `/products/productByCategory`,
                method: 'GET',
            }),
        }),


        getRelatedProducts: builder.query({
            query: (id) => ({
                url: `/products/${id}/related`,
                method: 'GET',
            }),
        })

    })
});


export const {
    useGetProductsQuery,
    useGetAllProductsQuery,
    useGetSingleProductQuery,

    // admin
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,

    // users
    useGetTopProductsQuery,
    useGetNewProductsQuery,
    usePostReviewMutation,
    useDeleteReviewMutation,
    useGetProductsByCategoryQuery,
    useGetRelatedProductsQuery
} = productsApiSlice