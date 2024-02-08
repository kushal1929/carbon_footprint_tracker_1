import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { FaQuestionCircle } from "react-icons/fa";
import "./common/Tailwind.css";

export const CarbonFootprintCalculatorVehicle = () => {
    const [vehicleMPG, setVehicleMPG] = useState('');
    const [vehicleFuel, setVehicleFuel] = useState("Petrol");
    const [vehicleDistance_car, setVehicleDistance_car] = useState('');
    const [motorcycletype,setmotorcycletype]=useState("Average Motorcycle");
    const [vehicleDistance_motorcycle, setVehicleDistance_motorcycle] =useState('');
    let [vehicleCarbonFootprint, setVehicleCarbonFootprint] = useState(null);
    const [username, setUsername] = useState("");

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const navigate = useNavigate();

    const toggleTooltip = () => {
      setTooltipVisible(!tooltipVisible);
    };

    const calculateCarbonFootprintVehicle = async (vehicleCarbonFootprint) => {
        const newvehicledata ={
            vehicleMPG,
            vehicleFuel,
            vehicleDistance_car,
            motorcycletype,
            vehicleDistance_motorcycle,
            vehicleCarbonFootprint,
            timestamp:new Date(),
        };

        const userEmail = sessionStorage.getItem('User Email');
        const userQuery = query(usersCollection, where('email', '==', userEmail));

        try {
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setUsername(userDoc.id || '');

                const userDocRef = doc(usersCollection, userDoc.id);

                // Include year in the current month
                const currentDate = new Date();
                const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                const currentMonthRef = collection(userDocRef, currentMonthYear);

                // Use consumptionHome as the document id
                const consumptionVehicleRef = doc(currentMonthRef, 'consumptionvehicle');

                try {
                    await setDoc(consumptionVehicleRef,newvehicledata);
                    await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
                   
                } catch (error) {
                    alert(error.message);
                }
            } else {
                alert('User not found in Firestore');
            }
        } catch (error) {
            alert('Error fetching user data:', error.message);
        }
    }


    const calculateAndStoreTotal = async (currentMonthRef,currentMonthYear,userDocRef) => {
      const totalDocRef = collection(userDocRef, 'Total');
      const totalMYDocRef=doc(totalDocRef,currentMonthYear)

      const querySnapshot = await getDocs(currentMonthRef);
  
      let totalHome = 0;
      let totalFood = 0;
      let totalVehicle = 0;
      let totalFlight = 0;
      let totalPublicVehicle = 0;
      let totalExpenditure = 0;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalHome += data.homeCarbonFootprint || 0;
        totalFood += data.foodCarbonFootprint || 0;
        totalVehicle += data.vehicleCarbonFootprint || 0;
        totalFlight += data.flightCarbonFootprint || 0;
        totalPublicVehicle += data.PublicVehicleCarbonFootprint || 0;
        totalExpenditure += data.ExpenditureCarbonFootprint || 0;
      });
  
      const totalDocData = {
        totalHome,
        totalFood,
        totalVehicle,
        totalFlight,
        totalPublicVehicle,
        totalExpenditure,
        totalCarbonFootprint:
          totalHome + totalFood + totalVehicle + totalFlight + totalPublicVehicle + totalExpenditure,
          timestamp: new Date(),
      };
  
      try {
        await setDoc(totalMYDocRef, totalDocData);
      } catch (error) {
        
        alert(error.message);
      }
    };
    
    const handleVehicleCalculate = () => {
        // Calculate vehicle carbon footprint based on the selected vehicle type
        const FuelFactor_Petrol = 12.2;
        const FuelFactor_Diesel = 14.2;
        const avg_motor_cyc_emission_factor = 0.142;
        const small_motor_cyc_emission_factor =0.105;
        const medium_motor_cyc_emission_factor = 0.124;
        const large_motor_cyc_emission_factor = 0.167;
        const kmpl_to_mpg=2.35;
        const km_to_miles=0.62137;

        let vehicleCarbonFootprint_car = 0;
        let vehicleCarbonFootprint_motorcycle = 0;

        let vehicleCarbonFootprint = 0;
        if (vehicleMPG !== 0 && vehicleDistance_car !== 0) {
          if (vehicleFuel === "Petrol") {
            vehicleCarbonFootprint_car =
              (1 / vehicleMPG / kmpl_to_mpg) *
              FuelFactor_Petrol *
              vehicleDistance_car *
              km_to_miles;
          } else if (vehicleFuel === "Diesel") {
            vehicleCarbonFootprint_car =
              (1 / vehicleMPG / kmpl_to_mpg) *
              FuelFactor_Diesel *
              vehicleDistance_car *
              km_to_miles;
          }
        }

        // Check for division by zero and valid distance
        if (vehicleDistance_motorcycle !== 0) {
          if (motorcycletype === "Average Motorcycle") {
            vehicleCarbonFootprint_motorcycle =
              vehicleDistance_motorcycle * avg_motor_cyc_emission_factor;
          } else if (motorcycletype === "Small Motorcycle") {
            vehicleCarbonFootprint_motorcycle =
              vehicleDistance_motorcycle * small_motor_cyc_emission_factor;
          } else if (motorcycletype === "Medium Motorcycle") {
            vehicleCarbonFootprint_motorcycle =
              vehicleDistance_motorcycle * medium_motor_cyc_emission_factor;
          } else if (motorcycletype === "Large Motorcycle") {
            vehicleCarbonFootprint_motorcycle =
              vehicleDistance_motorcycle * large_motor_cyc_emission_factor;
          }
        }

        const totalVehicleCarbonFootprint =vehicleCarbonFootprint_car + vehicleCarbonFootprint_motorcycle;

        setVehicleCarbonFootprint(totalVehicleCarbonFootprint);
        calculateCarbonFootprintVehicle(totalVehicleCarbonFootprint);
    };

    
    return (
      <div className="w-[90%] flex flex-col items-center py-10 mx-[5vw]">
        <div className="w-full pt-5 text:black bg-white font-extrabold text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center z-10">
          Private Vehicle Carbon Footprint
        </div>

        <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
          <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Mileage:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleMPG}
                  placeholder="In km/L"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) => setVehicleMPG(Number(e.target.value))}
                />
              </label>
            </div>

            <div className="flex flex-wrap flex-row items-center mb-4">
              <label htmlFor="vehicleFuel" className="mr-2 font-medium">
                Select Fuel Type:
              </label>
              <select
                id="vehicleFuel"
                value={vehicleFuel}
                className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
                onChange={(e) => setVehicleFuel(e.target.value)}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            <br />

            <div className="flex flex-wrap flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Car:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleDistance_car}
                  placeholder="Distance in km"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) =>
                    setVehicleDistance_car(Number(e.target.value))
                  }
                />
              </label>
            </div>

            <br />

            <div className="flex flex-row">
              <div>
                <FaQuestionCircle
                  onMouseEnter={toggleTooltip}
                  onMouseLeave={toggleTooltip}
                />
                {tooltipVisible && (
                  <div className="absolute -left-[24px] bg-white p-2 rounded shadow-lg z-10">
                    <div className="flex flex-col z-10">
                      <p>Engine sizes:</p>
                      <li>Small &lt;125cc </li>
                      <li>Medium 125cc to 150cc</li>
                      <li>Large &gt;500cc</li>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center mb-4">
                <label htmlFor="motorcycleType" className="mr-2 font-medium">
                  Motorcycle type:
                </label>
                <select
                  id="motorcycleType"
                  value={motorcycletype}
                  className="block rounded-sm bg-white px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500 sm:ml-0"
                  onChange={(e) => setmotorcycletype(e.target.value)}
                >
                  <option value="Average Motorcycle">Average Motorcycle</option>
                  <option value="Small Motorcycle">Small Motorcycle</option>
                  <option value="Medium Motorcycle">Medium Motorcycle</option>
                  <option value="Large Motorcycle">Large Motorcycle</option>
                </select>
              </div>
            </div>
            <br />

            <div className="flex flex-row items-center justify-center mb-4">
              <span className="mr-2 font-medium">Motorcycle:</span>
              <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleDistance_motorcycle}
                  placeholder="Distance in km"
                  className="block w-full rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) =>
                    setVehicleDistance_motorcycle(Number(e.target.value))
                  }
                />
              </label>
            </div>

            <br />

            <button onClick={handleVehicleCalculate}>
              <a className="group inline-block rounded bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
                <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                  Calculate
                </span>
              </a>
            </button>
            <br />
            {vehicleCarbonFootprint !== null && (
              <div className="text-xl font-bold mb-4">
                <p>Your estimated vehicle carbon footprint is: </p>
                <p>{vehicleCarbonFootprint} kgCO2 per month</p>
              </div>
            )}
            {/* {calculateCarbonFootprintVehicle} */}
          </div>

          <div className="flex lg:h-full w-0 lg:w-1/2 px-5 py-10">
          <img className="object-contain" src={require("../assets/vehicle.jpg")}/>
        </div>
        </div>
      </div>
    );
};

export default CarbonFootprintCalculatorVehicle;
