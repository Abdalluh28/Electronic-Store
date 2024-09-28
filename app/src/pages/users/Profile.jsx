import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useUpdateProfileMutation } from '../../redux/features/users/usersApiSlice'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'
export default function Profile() {
    let userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null
    
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [updatedFirstName, setUpdatedFirstName] = useState('')
    const [userInputs, setUserInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate();
    const togglePasswordVisibility = (type) => {
        if (type === 'password') {
            setPasswordVisible(!passwordVisible)
        } else if (type === 'confirmPassword') {
            setConfirmPasswordVisible(!confirmPasswordVisible)
        }
    }

    useEffect(() => {
        if (userInfo && !userInfo.isVerified) {
            navigate('/auth/login')
        }
    },[userInfo])

    const [updateProfile, { isLoading }] = useUpdateProfileMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (userInputs.password) {
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
                })
                return
            }
            if (!userInputs.confirmPassword) {
                toast.error('Please confirm your password', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            }
            if (userInputs.password !== userInputs.confirmPassword) {
                toast.error('Passwords do not match', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                return
            }
        }



        const { data, error: err } = await updateProfile(userInputs)
        console.log(err)
        if (err) {
            toast.error(err.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })

            return
        }

        if(userInputs.email) {
            Cookies.set('userInfo', JSON.stringify(data))
            toast.success('Email updated successfully, Please login again', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                onClose: () => navigate('/auth/login')
            })
            return
        }
        Cookies.set('userInfo', JSON.stringify(data))
        toast.success('Profile Updated successfully', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        setUpdatedFirstName(data.firstName)
        

    }

    useEffect(() => {
        if (updatedFirstName) {
            const div = document.querySelector('.navigationUserName')
            if (div) {
                div.innerHTML = updatedFirstName
            }
        }
    },[updatedFirstName])

    return (
        <>
            <div className='container mt-14'>
                <div className='row'>
                    <div className='col-lg-2 lg:block hidden '></div>
                    <div className='col-lg-8 col-md-10 col-12'>
                        <form className='form flex flex-col gap-4' onSubmit={handleSubmit}>
                            <h4 className='text-3xl font-bold'>Update Profile</h4>
                            <div className='flex flex-col gap-1'>
                                <label className='' htmlFor='firstName'>First Name</label>
                                <input
                                    className='border-1 rounded-xl w-[90%] sm:w-[75%] bg-black'
                                    type="text"
                                    name="Name"
                                    id="firstName"
                                    placeholder={userInfo.firstName}
                                    onChange={(e) => setUserInputs({ ...userInputs, firstName: e.target.value })}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='' htmlFor='lastName'>last Name</label>
                                <input
                                    className='border-1 rounded-xl w-[90%] sm:w-[75%] bg-black'
                                    type="text"
                                    name="Name"
                                    id="lastName"
                                    placeholder={userInfo.lastName}
                                    onChange={(e) => setUserInputs({ ...userInputs, lastName: e.target.value })}
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='' htmlFor='email'>Email Address</label>
                                <input
                                    className='border-1 rounded-xl w-[90%] sm:w-[75%] bg-black'
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder={userInfo.email}
                                    onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })}
                                />
                            </div>
                            <div className='flex flex-col gap-1 mt-2'>
                                <label className='' htmlFor='password'>Password</label>
                                <div className='relative'>
                                    <input
                                        className='border-1 rounded-xl w-[90%] sm:w-[75%] bg-black'
                                        type={passwordVisible ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder='Enter password'
                                        onCopy={(e) => e.preventDefault()}
                                        onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
                                    />
                                    <FontAwesomeIcon
                                        icon={passwordVisible ? faEye : faEyeSlash}
                                        className='-translate-x-8 cursor-pointer text-lg'
                                        onClick={() => togglePasswordVisibility('password')}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-1 mt-2'>
                                <label className='' htmlFor='confirmPassword'>Confirm Password</label>
                                <div className='relative'>
                                    <input
                                        className='border-1 rounded-xl w-[90%] sm:w-[75%] bg-black'
                                        type={confirmPasswordVisible ? "text" : "password"}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder='Confirm password'
                                        onCopy={(e) => e.preventDefault()}
                                        onChange={(e) => setUserInputs({ ...userInputs, confirmPassword: e.target.value })}
                                    />
                                    <FontAwesomeIcon
                                        icon={confirmPasswordVisible ? faEye : faEyeSlash}
                                        className='-translate-x-8 cursor-pointer text-lg'
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-between w-[100%] sm:w-[75%]'>
                                <button className='w-fit text-white btn btn-outline-primary p-2 px-4 rounded-lg' type='submit'>
                                    {isLoading ? <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner> : 'Update Profile'}
                                </button>
                                <Link to='/users/myOrders' className='w-fit ms-auto underline text-white p-2 rounded-lg mt-1 underline-offset-8 ' >
                                    My Orders
                                </Link>
                            </div>
                        </form>
                    </div>
                    <div className='col-2 lg:block hidden '></div>
                </div>
            </div>
        </>
    )
}
