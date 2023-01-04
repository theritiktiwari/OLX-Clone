import React from 'react';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { MagnifyingGlass } from 'react-loader-spinner'

const Loader = () => {
    return (
        <div className='loader'>
            <MagnifyingGlass
                visible={true}
                height="80"
                width="80"
                ariaLabel="MagnifyingGlass-loading"
                wrapperClass="MagnifyingGlass-wrapper"
                glassColor='#40C9A2'
                color='#664147'
            />
        </div>
    )
}

export default Loader