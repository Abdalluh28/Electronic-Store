import {apiSlice} from "../../api/apiSlice";



const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (data) => ({
                url: `/users`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${data.accessToken}`
                }
            }),
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: `/users/profile`,
                method: "PUT",
                body: { ...data},
            }),
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "DELETE",
                body: { ...data},
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${data.accessToken}`
                }
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "PUT",
                body: { ...data},
                headers: {
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${data.accessToken}`
                }
            })
        })
    }),
})


export const {
    useGetUsersQuery,
    useUpdateProfileMutation,
    useDeleteUserMutation,
    useUpdateUserMutation
} = userApiSlice