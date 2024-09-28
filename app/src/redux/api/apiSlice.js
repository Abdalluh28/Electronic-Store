import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = Cookies.get('accessToken')
        if(token) {
            headers.set('authorization',`Bearer ${token}`)
        }
        return headers
    },
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if(refreshResult?.data) {
            const {accessToken} = refreshResult.data

            Cookies.set('accessToken', accessToken)

            result = await baseQuery(args, api, extraOptions)
        } else {
            if(refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired. Please login again' 
                return refreshResult
            }
        }
    }

    return result
}


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({})
})
