import React from 'react';
import Header from './common/Header';
import "./common/Tailwind.css";

const CFOffset=()=>{
return(
        

    <>
    <Header className="sticky top-0"/>
    <main class="pt-4 pb-16 lg:pt-0 lg:pb-24 bg-white antialiased"></main>
        <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue ">


                <header class="mb-4 lg:mb-6 not-format">
                        <address class="flex items-center mb-6 not-italic">
                            <div class="inline-flex items-center mr-3 text-sm text-gray-900">
                                
                                <div>
                                    <a href="#" rel="author" class="text-xl font-bold text-gray-900 ">Shishir Ashok</a>
                                    <p class="text-base text-gray-500 dark:text-gray-400">CS Undergrad</p>
                                    <p class="text-base text-gray-500 dark:text-gray-400"><time pubdate datetime="2022-02-08" title="February 14th, 2024">Feb. 14, 2024</time></p>
                                </div>
                            </div>
                        </address>
                        <h1 class="font-bold mb-4 text-3xl  leading-tight text-gray-900 lg:mb-6 lg:text-4xl ">Beyond Footprints: Balancing the Environmental Equation</h1>
                    </header>
                    <h3 class="font-normal text-xl text-base text-gray-500 ">Decoding the Panacea that is Carbon Offsetting to Re-write the Script of Climate Change.</h3>
                    <p>As the spotlight on climate change intensifies, our collective role as both protagonists 
                    and antagonists becomes ever more clear. Amidst the bleakness, there exists a ray of hope- 
                    a dramatic redemption that gives us a second chance to re-write the script: Carbon Offsetting.</p>
                    <p>Carbon Offsetting is an act of counterbalancing our carbon emissions by investing in projects
                         that help restoration on our wounded Mother Earth. We do this to achieve a balance between the
                          emissions released into the atmosphere and those offset through environmentally beneficial projects </p>
                    
                    <iframe width="95%" height="15%"
                        src="https://www.youtube.com/embed/OUfhLkMhc8w"> 
                    </iframe>
                    
                    <h3 className="py-3">Understanding Carbon Offsetting</h3>
                    <p>At its core, carbon offsetting is a practice designed to counterbalance the greenhouse gas emissions 
                        we generate in our daily lives. These emissions, stemming from activities like transportation, energy 
                        consumption, and industrial processes, contribute to the global pool of carbon dioxide and other 
                        climate-altering gases. Carbon offsetting seeks to mitigate this impact by investing in projects 
                        that either reduce emissions elsewhere or remove an equivalent amount of greenhouse gases from 
                        the atmosphere.The process begins with the measurement of the amount of carbon emissions produced 
                        by an individual or an organization. Once this carbon footprint is quantified, the equivalent amount 
                        of emissions can be offset through various environmental projects</p>
                    
                    <h3>Efficacy of Carbon Offsetting</h3>
                    <p>Carbon offsets work by counterbalancing emissions that have already occurred. They are a 
                        reactive measure, allowing individuals and organizations to invest in environmental projects that 
                        reduce or absorb carbon dioxide, effectively balancing out their own emissions. To maximise the 
                        effect of carbon offsetting, it should be paired with a broader strategy that includes direct actions
                        including adopting cleaner technologies, enhancing energy efficiency, or changing business practices
                         and lifestyles to be more sustainable
                        </p>
                    
                    

                    
                    
                    
                    
                <figure>
                    <img src="https://assets.weforum.org/editor/Ftm13K__2so9syH4Fz1bQe038Oi4WZGv_aOmWp32q44.JPG" alt=""/>
                    <figcaption>Image from graphs.net</figcaption>
                </figure>
            
                    <h3>Where Can I Contribute?</h3>
                    <p>Choosing your Carbon Offset Project is perhaps the greatest factor in the efficacy of Offsetting.
                        We help you narrow your choice down to the following, based on credibility, transparency and tangible
                        impact</p>
                        <ol>
                        <li><strong>Atmosfair:</strong> Specializing in air travel,<a href="https://www.atmosfair.de/en/" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" target="_blank"> Atmosfair</a> they offer various subscription models to 
                        offset the carbon footprint of your air travel
                        </li>
                        <li><strong>United Nations:</strong><a href="https://offset.climateneutralnow.org/AllProjects" target="_blank"> United Nations Carbon Offset Platform</a> provide various programmes across various
                         renweable energy projects </li>

                        <li><strong>Carbon Checkout: </strong><a href="https://www.carboncheckout.com/" target="_blank">
                        Carbon Checkout</a> provides a seamless way to integrate carbon offsetting into online shopping, allowing customers to choose a 
                        carbon offset project at checkout, addressing the carbon footprint of their purchases.</li>
                        <li><strong>Myclimate: </strong><a href ="https://www.myclimate.org/en/?etcc_med=SEA&etcc_par=Google&etcc_cmp=%5Bmyclimate%5D+ROW_EN_ohne+CH_4&etcc_grp=59870930760&etcc_bky=myclimate&etcc_mty=e&etcc_plc&etcc_ctv=363117764536&etcc_bde=c&etcc_var=Cj0KCQiAn-2tBhDVARIsAGmStVkEq8GKKR8GqPFdkDt3RmeexXQiSxuNEOCBbpcpLxrhyedm2u66qAcaAuyQEALw_wcB&gad_source=1" target="_blank">
                         Myclimate</a>'s' diverse projects cover areas like hydropower, energy efficiency, land improvement, and water purification.
                        </li>
                    </ol>
                    


                    
                    
                         
                          
                                
            </article>        
        </div>
       

    </>
    );
};

export default CFOffset;