import { apiSlice } from "../../api/apiSlice";


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: {...data}
            })
        }),
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: {...data}
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: '/auth/logout',
                method: 'POST',
                body: {...data}
            })
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: '/auth/verifyEmail',
                method: 'POST',
                body: {...data}
            })
        }),
        sendVerificationEmail: builder.mutation({
            query: (data) => ({
                url: '/auth/sendVerificationEmail',
                method: 'POST',
                body: {...data}
            })
        }),
    })
})



export const { 
    useRegisterMutation, 
    useLoginMutation, 
    useRefreshMutation,
    useLogoutMutation,
    useVerifyEmailMutation,
    useSendVerificationEmailMutation 
} = authApiSlice