import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import imgOne from '../../assets/img.avif'
import { useResetMutation } from '../../redux/features/password/passwordApiSlice'
import { Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
export default function ResetPassword() {


    const { id, accessToken } = useParams();

    const [reset, { isLoading }] = useResetMutation();

    const [userInputs, setUserInputs] = useState({
        password: ''
    })

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();



        try {

            if (userInputs.password.length < 8) {
                toast.error('Password length should be 8 characters at least', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => navigate('/auth/login'),
                })
                return
            } 

            console.log(accessToken, id)
            const { data } = await reset({
                password: userInputs.password,
                id, accessToken
            })

            if (data.message.includes('successful')) {
                toast.success('Password reset successfully', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => navigate('/auth/login'),
                });
            }


        } catch (error) {
            toast.error(error, {
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

    const eyeSlash = () => {
        document.querySelector('.eyeSlash').style.display = 'none'
        document.querySelector('.eyeShow').style.display = 'block'
        document.querySelector('#password').setAttribute('type', 'text')
    }

    const eyeShow = () => {
        document.querySelector('.eyeShow').style.display = 'none'
        document.querySelector('.eyeSlash').style.display = 'block'
        document.querySelector('#password').setAttribute('type', 'password')
    }
    return (
        <div className='w-full grid lg:grid-cols-2 grid-cols-1 h-[95%]'>
            <div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <h4 className='text-3xl font-bold'>Reset Password</h4>
                    <div className='flex flex-col gap-1'>
                        <label className='' htmlFor='password'>Password</label>
                        <div className='flex flex-col w-75'>
                            <input required className='border-1 rounded-xl bg-black' type="password" name="password" id="password" value={userInputs.password}
                                onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
                                onCopy={(e) => e.preventDefault()} />
                            <FontAwesomeIcon icon={faEyeSlash} className='self-end -translate-y-9 -translate-x-1 cursor-pointer text-lg p-1 -mb-5 eyeSlash'
                                onClick={eyeSlash} />
                            <FontAwesomeIcon icon={faEye} className='self-end -translate-y-9 -translate-x-1 cursor-pointer text-lg p-1 -mb-5 hidden eyeShow'
                                onClick={eyeShow} />
                            <div style={{ display: 'none' }} className='text-red-500 text-lg passwordIsWrong'>Incorrect password</div>
                        </div>
                    </div>
                    <button className='w-25 text-white btn btn-outline-primary p-2 rounded-lg' type='submit'>
                        {isLoading ? <Spinner animation="border" /> : 'Submit'}
                    </button>
                </form>
            </div>
            <img alt='image' className=' max-h-full h-full rounded-lg lg:block hidden' src={imgOne} />
        </div>
    )
}
