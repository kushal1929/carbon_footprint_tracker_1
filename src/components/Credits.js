import React from "react";
import Header from "./common/Header";
import "./common/Tailwind.css";
import Credits_Card from "./common/Credits_card";

export default function Credits() {
  return (
    <div>
      <Header />
      <section className="bg-white text-black">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className=' mx-auto flex mt-[3%] pb-4 w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl'>
                Attributions
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            
            <Credits_Card num = "1."
            url="https://www.freepik.com/free-vector/isometric-family-budget-composition-with-people-counting-money-vector-illustration_39094315.htm"
            text="Image by macrovector on Freepik"/>

            <Credits_Card num = "2."
            url="https://www.freepik.com/free-vector/plane-sky-with-balloon-flat-style_24780703.htm"
            text="Image by brgfx on Freepik"/>

            <Credits_Card num = "3."
            url="https://www.freepik.com/free-vector/passengers-waiting-bus-city-queue-town-road-flat-vector-illustration-public-transport-urban-lifestyle_10173277.htm"
            text="Image by pch.vector on Freepik"/>

            <Credits_Card num = "4."
            url="https://www.freepik.com/free-vector/eco-transport-design-concept-set-six-square-icons-with-people-riding-bikes-skateboards-electric-cars-illustration_21744730.htm"
            text="Image by macrovector on Freepik"/>

            <Credits_Card num = "5."
            url="https://www.freepik.com/free-vector/fast-food-icon-set_3925018.htm"
            text="Image by macrovector on Freepik"/>

            <Credits_Card num = "6."
            url="https://www.freepik.com/free-vector/green-tropical-leaves-decorative-background_5061635.htm#fromView=image_search&track=&regularType=vector&page=1&position=36&uuid=d76804c2-dc74-4779-8f31-0f7c90a33110"
            text="Image by pikisuperstar on Freepik"/>

            <Credits_Card num = "7."
            url="https://www.freepik.com/free-vector/isometric-composition-with-modern-suburban-two-storeyd-private-house-clean-yard_4188443.htm#&position=0&from_view=search&track=ais&uuid=5004728f-4a77-499d-973d-3708f0b56c74"
            text="Image by macrovector on Freepik"/>

            <Credits_Card num = "8."
            url="https://www.freepik.com/free-ai-image/three-dimensional-trees-with-vegetation_82900274.htm"
            text="Login page image by Freepik"/>

            <Credits_Card num = "9."
            url="https://www.freepik.com/free-ai-image/view-3d-graphic-nature-landscape_71906901.htm"
            text="Signup page image by Freepik"/>

            <Credits_Card num = "10."
            url="https://www.freepik.com/free-ai-image/digital-art-with-planet-earth_94939308.htm"
            text="Landing page image by Freepik"/>


            
          </div>
        </div>
      </section>
    </div>
  );
}
