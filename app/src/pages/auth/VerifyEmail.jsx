import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useVerifyEmailMutation } from '../../redux/features/auth/authApiSlice';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const { id, accessToken } = useParams();
    const [verifyEmail] = useVerifyEmailMutation();

    useEffect(() => {
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);
        Cookies.set('accessToken', accessToken, { expires: expiryDate });

        const verifyEmailHandler = async () => {
            try {
                const { data } = await verifyEmail({ id, accessToken }).unwrap(); 
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Email Verified Successfully',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    Cookies.set('userInfo', JSON.stringify({ 
                        email: data?.email,
                        firstName: data?.firstName,
                        lastName: data?.lastName,
                        isVerified: data?.isVerified,
                        id: data?.id    
                    }));
                    navigate('/');
                });
            } catch (error) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Failed to Verify Email',
                    text: error.message,
                    showConfirmButton: true,
                });
            }
        };

        verifyEmailHandler();
    }, [accessToken, id, navigate, verifyEmail]);

    return <></>;
}
