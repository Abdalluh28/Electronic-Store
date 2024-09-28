import { apiSlice } from "../../api/apiSlice";


const favouriteApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        clearFavouriteDB: builder.mutation({
            query: (data) => ({
                url: '/favourite',
                method: 'DELETE',
                body: {...data}
            })
        })
    })
})


export const { useClearFavouriteDBMutation } = favouriteApiSlice