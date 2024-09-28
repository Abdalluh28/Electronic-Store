import { apiSlice } from "../../api/apiSlice";

const passwordApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        forgot: builder.mutation({
            query: (data) => ({
                url: `/password/forgot`,
                method: 'POST',
                body: { ...data }
            })
        }),
        reset: builder.mutation({
            query: (data) => ({
                url: `/password/reset`,
                method: 'POST',
                body: { ...data }
            })
        })
    })
})


export const { useForgotMutation, useResetMutation } = passwordApiSlice