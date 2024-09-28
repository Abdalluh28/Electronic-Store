const { apiSlice } = require('../../api/apiSlice')


const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (data) => ({
                url: '/category/categories',
            }),
        }),
        getCategory: builder.query({
            query: ({productId}) => ({
                url: `/category/${productId}`,
            }),
        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/category',
                method: 'POST',
                body: { ...data },
                Headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${data.accessToken}`
                }
            }),
        }),

        updateCategory: builder.mutation({
            query: (data) => ({
                url: `/category/${data.id}`,
                method: 'PUT',
                body: { ...data },
                Headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${data.accessToken}`
                }
            }),
        }),

        deleteCategory: builder.mutation({
            query: (data) => ({
                url: `/category/${data.id}`,
                method: 'DELETE',
                Headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${data.accessToken}`
                }
            }),
        }),
    })
})



export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoriesApiSlice

