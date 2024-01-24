import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <Header />
      
        <div
          className="flex flex-wrap w-full rounded-lg border border-gray-100 text-sm text-gray-500 my-[3%]"
        >
          <button className="flex grow lime-200" onClick={handleNavigateToCarbon}>
            <div className="flex grow items-center justify-center gap-2 p-4" style={{
                backgroundColor: activeSection === "carbon" ? "lightgreen" : "rgb(233,233,233)",
              }}>

              <FaHouse size={30}/>

              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Home Footprint </strong>
                <small className="mt-1">Carbon Footprint at home </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToEatingHabits}>
            <div  style={{
                backgroundColor: activeSection === "eating" ? "lightgreen" : "lightgrey",
              }} className="flex grow items-center justify-center gap-2 p-4">
            
              <FaBowlRice size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Eating Footprint </strong>
                <small className="mt-1">Carbon Footprint in Eating Habits </small>
              </p>
            </div>
          </button>

          <button className="flex grow " onClick={handleNavigateToVehicle}>
            <div className="flex grow items-center justify-center gap-2 p-4" style={{
                backgroundColor: activeSection === "vehicle" ? "lightgreen" : "lightgrey",
              }}>
              <FaCar size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Vehicle Footprint </strong>
                <small className="mt-1">Carbon Footprint of Private Vehicles </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToPublicVehicle}>
            <div className="flex grow items-center justify-center gap-2 p-4" style={{
                backgroundColor: activeSection === "public_vehicle" ? "lightgreen" : "lightgrey",
              }}>
              <FaBusSimple size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Public Transport </strong>
                <small className="mt-1">Carbon Footprint on Public Vehicles </small>
              </p>
            </div>
          </button>

          <button  className="flex grow" onClick={handleNavigateToFlight}>
            <div className="flex grow items-center justify-center gap-2 p-4" style={{
                backgroundColor: activeSection === "Flight" ? "darkgrey" : "lightgrey",
              }}>
              <FaPlane size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Flight footprint </strong>
                <small className="mt-1">Carbon Footprint on Flights </small>
              </p>
            </div>
          </button>

          <button className="flex grow" onClick={handleNavigateToExpenditure}>
            <div className="flex grow items-center justify-center gap-2 p-4" style={{
                backgroundColor: activeSection === "expenditure" ? "lightgreen" : "lightgrey",
              }}>
              <FaDollarSign size={30}/>
              <p className="hidden sm:leading-none sm:block">
                <strong className="block font-medium"> Expenditure </strong>
                <small className="mt-1">Carbon Footprint based on Expenditure </small>
              </p>
            </div>
          </button>
          
        </div>
      
      
        <div>
          {/* <button onClick={handleNavigateToCarbon}>Calculate Carbon Footprint</button>
        <button onClick={handleNavigateToEatingHabits}>Eating Habits</button> */}

          {activeSection === "carbon" && <CarbonFootprintCalculator />}
          {activeSection === "eating" && <EatingHabits />}
          {activeSection === "vehicle" && <CarbonFootprintCalculatorVehicle />}
          {activeSection === "public_vehicle" && (<CarbonFootprintCalculatorPublicVehicle />)}
          {activeSection === "expenditure" && (<CarbonFootprintCalculatorExpenditure />)}
          {activeSection === "Flight" && (<Flight />)}
        </div>

    </div>
  );
};

export default ConsumptionData;
