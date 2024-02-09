import React, { useState } from "react";
import CarbonFootprintCalculator from "./carbon";
import EatingHabits from "./EatingHabits";
import Header from "./common/Header";
import CarbonFootprintCalculatorVehicle from "./vehicle";
import CarbonFootprintCalculatorPublicVehicle from "./public_transport";
import { CarbonFootprintCalculatorExpenditure } from "./expenditure";
import Flight from "./Flight";
import "./common/Tailwind.css";
import { FaBowlRice,FaCar ,FaBusSimple, FaHouse, FaPlane, FaDollarSign  } from "react-icons/fa6";

const ConsumptionData = () => {
  const [activeSection, setActiveSection] = useState("carbon"); // 'carbon' or 'eating'

  const handleNavigateToCarbon = () => {
    setActiveSection("carbon");
  };

  const handleNavigateToEatingHabits = () => {
    setActiveSection("eating");
  };

  const handleNavigateToVehicle = () => {
    setActiveSection("vehicle");
  };

  const handleNavigateToPublicVehicle = () => {
    setActiveSection("public_vehicle");
  };

  const handleNavigateToExpenditure = () => {
    setActiveSection("expenditure");
  };

  const handleNavigateToFlight = () => {
    setActiveSection("Flight");
  };

  return (
    <div className="bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300">
      <Header />
      
        <div
          className="flex flex-wrap w-full rounded-lg border border-gray-100 text-sm text-emerald-700 my-[3%]"
        >
          <button className="flex grow " onClick={handleNavigateToCarbon}>
            <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "carbon" ? "bg-emerald-700 text-white" : "bg-white"}`}>

              <FaHouse size={30}/>

              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Home Footprint </strong>
                <small className="mt-1">Carbon Footprint at home </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToEatingHabits}>
          <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "eating" ? "bg-emerald-700 text-white" : "bg-white"}`}>
            
              <FaBowlRice size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Eating Footprint </strong>
                <small className="mt-1">Carbon Footprint in Eating Habits </small>
              </p>
            </div>
          </button>

          <button className="flex grow " onClick={handleNavigateToVehicle}>
          <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "vehicle" ? "bg-emerald-700 text-white" : "bg-white"}`}>
              <FaCar size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Vehicle Footprint </strong>
                <small className="mt-1">Carbon Footprint of Private Vehicles </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToPublicVehicle}>
          <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "public_vehicle" ? "bg-emerald-700 text-white" : "bg-white"}`}>
              <FaBusSimple size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Public Transport </strong>
                <small className="mt-1">Carbon Footprint on Public Vehicles </small>
              </p>
            </div>
          </button>

          <button  className="flex grow" onClick={handleNavigateToFlight}>
          <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "Flight" ? "bg-emerald-700 text-white" : "bg-white"}`}>
              <FaPlane size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Flight footprint </strong>
                <small className="mt-1">Carbon Footprint on Flights </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToExpenditure}>
          <div className={`flex flex-grow items-center justify-center gap-2 p-4 ${activeSection === "expenditure" ? "bg-emerald-700 text-white" : "bg-white"}`}>
              <FaDollarSign size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Expenditure </strong>
                <small className="mt-1">Carbon Footprint based on Expenditure </small>
              </p>
            </div>
          </button>
          
        </div>
      
      
        
          {/* <button onClick={handleNavigateToCarbon}>Calculate Carbon Footprint</button>
        <button onClick={handleNavigateToEatingHabits}>Eating Habits</button> */}

          {activeSection === "carbon" && <CarbonFootprintCalculator />}
          {activeSection === "eating" && <EatingHabits />}
          {activeSection === "vehicle" && <CarbonFootprintCalculatorVehicle />}
          {activeSection === "public_vehicle" && (<CarbonFootprintCalculatorPublicVehicle />)}
          {activeSection === "expenditure" && (<CarbonFootprintCalculatorExpenditure />)}
          {activeSection === "Flight" && (<Flight />)}
        

    </div>
  );
};

export default ConsumptionData;