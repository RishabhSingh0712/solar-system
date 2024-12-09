import React from 'react';
import {Blocks} from 'react-loader-spinner';

const Loader = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen bg-white"> 
            <Blocks
                height="80"
                width="80"      
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
            />
            <p className='text-xs text-gray-500 '>Loading.....</p>
        </div>
    );
};

export default Loader;