const { apiSlice } = require('../../api/apiSlice')


const uploadApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'POST',
                body: formData
            })
        }),
        deleteImage: builder.mutation({
            query: ({id,index}) => ({
                url: '/upload/delete',
                method: 'DELETE',
                body: {id,index}
            })
        }),
    })
})



export const { 
    useUploadImageMutation,
    useDeleteImageMutation
} = uploadApiSlice