import React, { useEffect, useState, useRef } from 'react'
import { useRegisterMutation } from '../../redux/features/auth/authApiSlice'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import imgOne from '../../assets/img.avif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { toast } from 'react-toastify'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from 'react-bootstrap'

export default function Register() {
    const accessToken = Cookies.get('accessToken') ? Cookies.get('accessToken') : null
    const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null

    const [userInputs, setUserInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [register, { isLoading }] = useRegisterMutation()
    const navigate = useNavigate()

    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

    useEffect(() => {
        if (accessToken && userInfo.isVerified) {
            navigate('/')
        }
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault()

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
                })
                return
            }

            if (userInputs.password !== userInputs.confirmPassword) {
                toast.error('Password does not match', {
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
            const firstName = userInputs.name.split(' ')[0]
            const lastName = userInputs.name.split(' ').slice(1).join(' ')
            const { data, error: err } = await register({
                firstName,
                lastName,
                email: userInputs.email,
                password: userInputs.password
            })
            console.log(data)
            if(err && err.status === 400) {
                toast.error('Please provide the full name', {
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
            else if (err && err.status === 401) {
                toast.error('User already exists', {
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
            } else if (err) {
                toast.error('Something went wrong', {
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

            const accessToken = data?.accessToken
            const refreshToken = data?.refreshToken
            if (accessToken) {

                const expiryDate = new Date()
                expiryDate.setMinutes(expiryDate.getMinutes() + 15)
                Cookies.set('accessToken', accessToken, { expires: expiryDate })
                const userInfo = {
                    email: data?.email,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    isVerified: data?.isVerified,
                    id: data?.id
                }
                expiryDate.setDate(expiryDate.getDate() + 7)
                Cookies.set('userInfo', JSON.stringify(userInfo), { expires: expiryDate })
                Cookies.set('jwt', refreshToken, { expires: expiryDate })

                setUserInputs({
                    name: '', email: '', password: "", confirmPassword: ""
                })

                toast.success('Please check your email to activate your account', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => navigate('/')
                })
            } 
        } catch (error) {
            console.log(error.message)
        }
    }

    const togglePasswordVisibility = (type) => {
        if (type === 'password') {
            setPasswordVisible(!passwordVisible)
        } else if (type === 'confirmPassword') {
            setConfirmPasswordVisible(!confirmPasswordVisible)
        }
    }

    return (
        <div className='w-full grid lg:grid-cols-2 grid-cols-1 h-[95%]'>
            <div>
                <form onSubmit={handleSubmit} className='form flex flex-col gap-4'>
                    <h4 className='text-3xl font-bold'>Sign Up</h4>
                    <div className='flex flex-col gap-1'>
                        <label className='' htmlFor='Name'>Name</label>
                        <input
                            required
                            className='border-1 rounded-xl w-75 bg-black'
                            type="text"
                            name="Name"
                            id="Name"
                            value={userInputs.name}
                            onChange={(e) => setUserInputs({ ...userInputs, name: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='' htmlFor='email'>Email Address</label>
                        <input
                            required
                            className='border-1 rounded-xl w-75 bg-black'
                            type="email"
                            name="email"
                            id="email"
                            value={userInputs.email}
                            onChange={(e) => setUserInputs({ ...userInputs, email: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col gap-1 mt-2'>
                        <label className='' htmlFor='password'>Password</label>
                        <div className='relative'>
                            <input
                                required
                                className='border-1 rounded-xl w-75 bg-black'
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                id="password"
                                value={userInputs.password}
                                onChange={(e) => setUserInputs({ ...userInputs, password: e.target.value })}
                                onCopy={(e) => e.preventDefault()}
                                ref={passwordRef}
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
                                required
                                className='border-1 rounded-xl w-75 bg-black'
                                type={confirmPasswordVisible ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={userInputs.confirmPassword}
                                onChange={(e) => setUserInputs({ ...userInputs, confirmPassword: e.target.value })}
                                onCopy={(e) => e.preventDefault()}
                                ref={confirmPasswordRef}
                            />
                            <FontAwesomeIcon
                                icon={confirmPasswordVisible ? faEye : faEyeSlash}
                                className='-translate-x-8 cursor-pointer text-lg'
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            />
                        </div>
                    </div>
                    <button className='w-25 text-white btn btn-outline-primary p-2 rounded-lg' type='submit'>
                        {isLoading ? <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> : 'Sign Up'}
                    </button>
                </form>
                <div className='flex gap-2 mt-3'>
                    <span>Already have an account ?</span>
                    <Link to='/auth/login' className='w-fit underline rounded-lg underline-offset-8 text-blue-400'>Login</Link>
                </div>
            </div>
            <img alt='image' className='max-h-full h-full rounded-lg lg:block hidden' src={imgOne} />
        </div>
    )
}
