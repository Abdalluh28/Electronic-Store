import { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import imgOne from '../assets/smartWatch.png'
import imgTwo from '../assets/headPhone.png'
import imgThree from '../assets/laptop.png'
import './Slider.css'

function Slider() {

    const [images, setImages] = useState([imgOne, imgTwo, imgThree]);
    const titles = ["Color Solar Watch", "Feel The Sound", "The Ultimate Powerhouse"]
    const desc = ["Get ready for a revolution", "Listen to your favorite music", "Get the most out of your device"]

    return (
        <>
            <Carousel className='mb-5'>
                {titles.map((title, index) => (
                    <Carousel.Item key={index} >
                        <div className="flex flex-col-reverse lg:flex-row justify-center items-center h-[400px] w-full lg:mb-8 mb-16 to-black text-white">
                            {/* Text Section */}
                            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-6">
                                <div className='lg:w-3/4 w-full h-full flex flex-col justify-center lg:items-start items-center'>
                                    <h3 className="text-3xl font-bold">{title}</h3>
                                    <p className="text-gray-500 text-lg lg:flex hidden">
                                        {desc[index]}
                                    </p>
                                    <Link to={`/shop`} className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 text-lg rounded-lg mt-4 w-fit">Shop Now</Link>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="w-full lg:w-1/2 h-full flex justify-center items-center">
                                <img
                                    className="lg:w-96 lg:h-96 w-72 h-72 rounded-xl "
                                    src={images[index]}
                                    alt="First slide"
                                />
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>

        </>
    );
}

export default Slider;