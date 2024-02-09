import React from "react";
import "./common/Tailwind.css";
import RecyclingCentersMap from './RecyclingCentersMap';
import Header from "./common/Header";

export default function Map(){
    return(
        <>
            <Header />
            <div className='flex flex-col justify-center items-center h-[90vh] w-full gap-x-6 px-2 sm:px-[10%] items-stretch '>
                <div className=' mx-auto flex mt-[3%] pb-4 w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl'>
                Recycling Centers near you !
                </div>
                <p className="mt-[2%] mx-auto">Note: You may have to zoom out</p>
                <div className="flex justify-center items-center w-full h-full px-2 sm:px-5 mt-[1%] mb-[5%]">
                    <RecyclingCentersMap />
                </div>
            </div>
        </>
       
    )
}