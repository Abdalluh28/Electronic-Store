import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import { useDispatch, useSelector } from 'react-redux';
import { setMaxPrice, setMinPrice } from '../../../../redux/slices/filterSlice';

const InteractiveDualRangeSlider = () => {
    const right = useRef();
    const left = useRef();
    const parent = useRef();

    const minPrice = useSelector(state => state.filter.minPrice);
    const maxPrice = useSelector(state => state.filter.maxPrice);
    const dispatch = useDispatch();
    const maxRange = 5000;

    const [leftValue, setLeftValue] = useState(minPrice);
    const [rightValue, setRightValue] = useState(maxPrice);


    useEffect(() => {
        gsap.registerPlugin(Draggable);
    
        const updateValues = (name) => {
            const parentWidth = parent.current.offsetWidth;
            const leftPosition = gsap.getProperty(left.current, 'x');
            const rightPosition = gsap.getProperty(right.current, 'x');
    
            const leftScaled = Math.round((leftPosition / parentWidth) * maxRange);
            const rightScaled = Math.round(((parentWidth + rightPosition) / parentWidth) * maxRange);
    
            if (name === 'left') {
                setLeftValue(leftScaled);
                updatePriceRange('min', leftScaled);
            } else {
                setRightValue(rightScaled);
                updatePriceRange('max', rightScaled);
            }
        };
    
        const createDraggable = (ref, name) => {
            Draggable.create(ref, {
                type: 'x',
                bounds: parent.current,
                onDrag: function () {
                    const parentWidth = parent.current.offsetWidth;
                    const leftPosition = gsap.getProperty(left.current, 'x');
                    const rightPosition = gsap.getProperty(right.current, 'x');
    
                    // Prevent the left handle from crossing the right handle
                    if (name === 'left' && leftPosition > rightPosition - 20) {
                        gsap.set(left.current, { x: rightPosition - 20 }); // Add some padding to avoid overlap
                    }
    
                    // Prevent the right handle from crossing the left handle
                    if (name === 'right' && rightPosition < leftPosition + 20) {
                        gsap.set(right.current, { x: leftPosition + 20 }); // Add some padding to avoid overlap
                    }
    
                    updateValues(name);
                },
                liveSnap: true,
                lockAxis: true,
            });
        };
    
        createDraggable(left.current, 'left');
        createDraggable(right.current, 'right');
    }, [maxRange]);
    
    

    useEffect(() => {
        const updateDraggables = () => {
            const parentWidth = parent.current.offsetWidth;

            const leftPosition = (minPrice / maxRange) * parentWidth;
            const rightPosition = (maxPrice / maxRange) * parentWidth;

            gsap.set(left.current, { x: leftPosition });
            gsap.set(right.current, { x: rightPosition - parentWidth });

            setLeftValue(minPrice);
            setRightValue(maxPrice);
        };

        updateDraggables();
    }, [minPrice, maxPrice, maxRange]);

    const debouncePrice = (cb, delay) => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                cb(...args);
            }, delay);
        }
    }

    const updatePriceRange = debouncePrice((name, value) => {
        if (name === 'min') {
            dispatch(setMinPrice(value));
        } else if (name === 'max') {
            dispatch(setMaxPrice(value));
        }
    }, 500);

    return (
        <div className="relative mt-8 mb-4">
            <fieldset className="border border-[#3b82f6] rounded-md px-4 pb-8 pt-6">
                <legend className="absolute -top-1 left-2 transform -translate-y-1/2 bg-black px-2 text-xl text-[#3b82f6] w-fit">
                    Price Range
                </legend>
                <div className="flex justify-center items-center" ref={parent}>
                    <div className='left w-5 h-5 bg-blue-700 rounded-[50%]' ref={left}></div>
                    <div className='range w-[95%] h-1 bg-blue-500' ></div>
                    <div className='right w-5 h-5 bg-blue-700 rounded-[50%] ' ref={right}></div>
                </div>
                <div className="flex justify-between mt-4">
                    <span>Min: {leftValue}</span>
                    <span>Max: {rightValue}</span>
                </div>
            </fieldset>
        </div>
    );
};

export default InteractiveDualRangeSlider;
