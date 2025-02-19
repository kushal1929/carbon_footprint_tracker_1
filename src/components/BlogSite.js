import React from 'react';
import Header from './common/Header';
import "./common/Tailwind.css";

const BlogSite=()=>{
    return(
        <>
        <Header/>
        <div class="flex flex-row justify-start gap-x-6 px-3 py-3  lg:p relative flex flex-wrap lg:h-[55%] lg:flex-start">
    <div class="bg-white shadow-md border border-grey-500 rounded-lg max-w-sm mb-5">
        <a href="/BlogSite/CFblog">
            <img class="rounded-t-lg" src="https://carbonneutral.com.au/wp-content/uploads/2023/02/carbon-footprint-1.jpg" alt=""/>
        </a>
        <div class="p-5">
            <a href="/BlogSite/CFblog">
                <h5 class="pt-3 text-gray-900 font-bold text-2xl tracking-tight">Footprints  in  the  Atmosphere:</h5>
                <h5 class="pt-3  text-gray-900 font-bold text-2xl tracking-tight mb-2">Unmasking Our Carbon Impact</h5>
            </a>
            <p class="font-normal text-gray-700 mb-3">Traversing the landscape of Carbon Conciousness and unravelling the numbers behind your Carbon Footprint</p>
            
        </div>
    </div>
    <div class="bg-white shadow-md border border-grey-500 rounded-lg max-w-sm mb-5">
        <a href="/BlogSite/CFOffset">
            <img class="rounded-t-lg" src="https://images.squarespace-cdn.com/content/v1/5e7203036c556712eb563b48/f63ab402-258f-447f-abf0-ddbd380c5bb1/IMG_4245.PNG?format=2500w" alt=""/>
        </a>
        <div class="p-5">
            <a href="/BlogSite/CFOffset">
                <h5 class="pt-3 text-gray-900 font-bold text-2xl tracking-tight mb-2 ">Beyond Footprints: Balancing the Environmental Equation with Carbon Offsetting</h5>
            </a>
            <p class="font-normal text-gray-700 mb-3">Decoding the Panacea that is Carbon Offsetting to Re-write the Script of Climate Change.</p>
            
        </div>
    </div>
 
</div>
</>
    );
};

export default BlogSite