import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <div className='absolute top-0 left-0 flex justify-center items-center w-[100vw] h-[100vh] bg-black/70'>
            <div className="loader">
                <div className="box">
                    <div className="logo">
                        <Image src="/loader.png" width={1080} height={1080} alt='no icon'/>
                    </div>
                </div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
                <div className="box"></div>
            </div>
        </div>
    )
}

export default Loader