import React, { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRefreshMutation } from '../../redux/features/auth/authApiSlice'
import { toast } from 'react-toastify' // Assuming you're using react-toastify for notifications

export default function RefreshToken() {

    const [refresh, { isLoading, isError, error }] = useRefreshMutation()

    const refreshToken = async () => {
        try {
            const { data } = await refresh()
            if (data?.accessToken) {  // Ensure the token is available in the response
                const expiryDate = new Date()
                expiryDate.setMinutes(expiryDate.getMinutes() + 15)
                Cookies.set('accessToken', data.accessToken, { expires: expiryDate })
            } else {
                throw new Error('Failed to get access token')
            }
        } catch (err) {
            if(err.status === 403) {
                toast.error('Your session has expired. Please log in again.', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        }
    }

    useEffect(() => {
        refreshToken()

        const interval = setInterval(refreshToken, 14 * 60 * 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            
        </>
    )
}
