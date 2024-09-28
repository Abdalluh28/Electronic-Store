import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Filters from './filters/Filters'


function Example({show, handleClose, handleShow}) {
    

    return (
        <>
            <Button onClick={handleShow} className='block lg:hidden  fixed bottom-10 right-10 text-2xl bg-[#0d6efd]'>
                <OverlayTrigger placement="top" overlay={<Tooltip className='text-xl'>Filters</Tooltip>}>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M10 14L4 5V3h16v2l-6 9v6l-4 2z"></path></g></svg>
                </OverlayTrigger>
            </Button>
            

            <Offcanvas placement='end' show={show} onHide={handleClose} className='bg-black text-white'>
                <Offcanvas.Header className='flex justify-end' >
                    <button className='text-white text-xl' onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Filters />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default Example;