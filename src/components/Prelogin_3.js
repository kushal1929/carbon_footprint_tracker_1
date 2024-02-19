import * as React from "react";
import './common/Tailwind.css';

export function InfoCard({heading,content,url,color})
{
    return(
        <div className="flex flex-col justify-center">
            <div className={`bg-${color} p-8 md:p-8 lg:px-6 lg:py-10`}>
                <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                    {heading}
                </h2>

                <p className="hidden text-white/90 sm:mt-4 sm:block">
                {content}
                </p>

                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 ">
                <img
                    alt=""
                    src={require(`../assets/${url}`)}
                    className="h-40 w-full object-cover sm:h-56 md:h-full"
                />
            </div>
        </div> 
    )
                        
}

export default function Prelogin_3()
{
    return(
        <>
            <section>
                <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                        <InfoCard
                            heading="User-Friendly Interface"
                            content="Our user-friendly interface ensures easy navigation and accessibility, making sustainability engaging."
                            url="home_ss.png"
                            color="lime-600"
                        />    
                        <InfoCard
                            heading="Carbon Footprint Calculator"
                            content="Detailed montly calculation based on lifestyle factors like transportation, energy use, and diet."
                            url='calc_ss.png'
                            color="lime-600"
                        />   
                    </div>
                </div>
            </section>
            <br/><br/>
            <section>
                <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                        <InfoCard
                            heading="Personalized Sustainability Plan"
                            content=" Tailored action plan to reduce carbon emissions, empowering
                            users with achievable steps."
                            url="pap_ss.png"
                            color="green-600"
                        />    
                        <InfoCard
                            heading="Competitive Leaderboards"
                            content="Engage in friendly competition, track progress, and motivate
                            peers through challenges and leaderboards."
                            url='leaderboard_ss.png'
                            color="green-600"
                        />   
                    </div>
                </div>
            </section>
            <br/><br/>
            <section>
                <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                        <InfoCard
                            heading="Analytics"
                            content="Users can monitor progress and gain insights into their
                            sustainability journey through analytics."
                            url="analytics_ss.png"
                            color="green-400"
                        />    
                        <InfoCard
                            heading="Interactive Map for Recycling Locations"
                            content=" Locate nearby recycling facilities for convenient waste
                            management."
                            url='maps_ss.png'
                            color="green-400"
                        />   
                    </div>
                </div>
            </section>
        </>
    )


}