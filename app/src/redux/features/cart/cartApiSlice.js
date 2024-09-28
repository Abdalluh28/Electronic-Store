import { apiSlice } from "../../api/apiSlice";


const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        clearCartDB: builder.mutation({
            query: (data) => ({
                url: '/cart',
                method: 'DELETE',
                body: {...data}
            })
        })
    })
})


export const { useClearCartDBMutation } = cartApiSlice