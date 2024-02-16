import React from 'react';
import Header from './common/Header';
import "./common/Tailwind.css";

const BlogSite=()=>{
    return(
        <>
        <Header/>
        <div class="pt-5 max-w-lg mx-auto">
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
</div>
</>
    );
};

export default BlogSite