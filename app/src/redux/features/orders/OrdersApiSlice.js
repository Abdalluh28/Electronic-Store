const { apiSlice } = require('../../api/apiSlice')


const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/orders',
                method: 'POST',
                body: { ...data },
                Headers: {
                    'authorization': `Bearer ${data.accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        }),

        getAllOrders: builder.query({
            query: ({ accessToken, page }) => ({
                url: '/orders',
                method: 'GET',
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                },
                params: { page }
            })
        }),


        getMyOrders: builder.query({
            query: ({ accessToken, id }) => ({
                url: `/orders/myorders/${id}`,
                method: 'GET',
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                },
            })
        }),


        getSingleOrder: builder.query({
            query: ({ id, accessToken }) => ({
                url: `/orders/${id}`,
                method: 'GET',
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            })
        }),



        updateOrderToPaid: builder.mutation({
            query: ({ id, accessToken }) => ({
                url: `/orders/${id}/pay`,
                method: 'PUT',
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            })
        }),



        updateOrderToDelivered: builder.mutation({
            query: ({ id, accessToken }) => ({
                url: `/orders/${id}/deliver`,
                method: 'PUT',
                Headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            })
        }),



        getTotalOrders: builder.query({
            query: () => ({
                url: '/orders/totalOrders',
                method: 'GET',
            })
        }),



        getTotalSales: builder.query({
            query: () => ({
                url: '/orders/totalSales',
                method: 'GET',
            })
        }),



        getTotalSalesByDate: builder.query({
            query: () => ({
                url: '/orders/totalSalesByDate',
                method: 'GET',
            })
        }),



        processPayment: builder.mutation({
            query: (data) => ({
                url: "/payment",
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json", // Ensure JSON format
                },
         
            }),
        }),

    })
})




export const {
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetMyOrdersQuery,
    useGetSingleOrderQuery,
    useUpdateOrderToPaidMutation,
    useUpdateOrderToDeliveredMutation,
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
    useProcessPaymentMutation
} = ordersApiSlice

