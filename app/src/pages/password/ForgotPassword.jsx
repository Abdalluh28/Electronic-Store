import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import imgOne from '../../assets/img.avif'
import { useForgotMutation } from '../../redux/features/password/passwordApiSlice'
import { Spinner } from 'react-bootstrap'
export default function ForgotPassword() {

    const [forgot, { isLoading }] = useForgotMutation();

    const [userInputs, setUserInputs] = useState({
        email: ''
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data, error: err } = await forgot({
                email: userInputs.email
            })

            if (err && err.status === 404) {
                document.querySelector('.userNotExist').style.display = 'block'
            } else {
                document.querySelector('.userNotExist').style.display = 'none'
            }

            console.log(data.message.includes('Email sent'))
            if(data.message.includes('Email sent')) {
                toast.success('Check your email', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "dark",
                    onOpen: () => navigate('/auth/login'),
                });
            }


        } catch (error) {
            console.log('error.message')
            toast.error('Something went wrong', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }


    return (
        <div className='w-full grid lg:grid-cols-2 grid-cols-1 h-[95%]'>
            <div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <h4 className='text-3xl font-bold'>Reset Password</h4>
                    <div className='flex flex-col gap-1'>
                        <label className='' id='email'>Email Address</label>
                        <input required className='border-1 rounded-xl w-75 bg-black' type="email" name="email" id="email" value={userInputs.email}
                            onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })} />
                        <div style={{ display: 'none' }} className=' text-red-500 text-lg userNotExist'>User does not exist</div>
                    </div>
                    <button className='w-25 text-white btn btn-outline-primary p-2 rounded-lg' type='submit'>
                        {isLoading ? <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> : 'Send Email'}
                    </button>
                </form>
            </div>
            <img alt='image' className=' max-h-full h-full rounded-lg lg:block hidden' src={imgOne} />
        </div>
    )
}
