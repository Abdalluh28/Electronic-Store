import React from 'react'
import { Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './Navigation';
import NavBar from './NavBar';


export default function Root() {
    return (
        <>
            <div className='flex flex-col'>
                <div className='md:hidden block mb-20'>
                    <NavBar />
                </div>
                <div className='flex w-full'>
                    <div className='w-32 hidden md:block'>
                        <Navigation />
                    </div>
                    <div className='flex-1 p-4'>
                        <ToastContainer />
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
