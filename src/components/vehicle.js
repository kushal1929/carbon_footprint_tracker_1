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
    const navigate = useNavigate();

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
                    console.log('Carbon footprint data saved to Firestore for the current month ', newvehicledata);
                    await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
                   
                } catch (error) {
                    console.error('Error saving carbon footprint data to Firestore:', error);
                    alert(error.message);
                }
            } else {
                console.log('User not found in Firestore');
                alert('User not found in Firestore');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
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
        console.log('Total carbon footprint data saved to Firestore for the current month ', totalDocData);
      } catch (error) {
        console.error('Error saving total carbon footprint data to Firestore:', error);
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
        <div className="w-full pt-5 text:black bg-white font-extrabold sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center">
          Private Vehicle CarbonFootPrint
        </div>

        <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
          <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
            <div className="flex flex-wrap flex-row items-center mb-4">
              <span className="mr-2 font-medium">Mileage:</span>
              <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleMPG}
                  placeholder="In km/L"
                  className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
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

            <div className="flex flex-wrap flex-row items-center mb-4">
              <span className="mr-2 font-medium">Car:</span>
              <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleDistance_car}
                  placeholder="Distance in km"
                  className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                  onChange={(e) =>
                    setVehicleDistance_car(Number(e.target.value))
                  }
                />
              </label>
            </div>

            <br />

            <div className="flex flex-wrap flex-row items-center mb-4">
              <label htmlFor="motorcycleType" className="mr-2 font-medium">
                Motorcycle type:
              </label>
              <select
                id="motorcycleType"
                value={motorcycletype}
                className="block rounded-sm bg-white px-3 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
                onChange={(e) => setmotorcycletype(e.target.value)}
              >
                <option value="Average Motorcycle">Average Motorcycle</option>
                <option value="Small Motorcycle">Small Motorcycle</option>
                <option value="Medium Motorcycle">Medium Motorcycle</option>
                <option value="Large Motorcycle">Large Motorcycle</option>
              </select>
            </div>

            <br />

            <div className="flex flex-wrap flex-row items-center mb-4">
              <span className="mr-2 font-medium">Motocycle:</span>
              <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
                <input
                  type="number"
                  value={vehicleDistance_motorcycle}
                  placeholder="Distance in km"
                  className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
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
            {calculateCarbonFootprintVehicle}
          </div>

          <div className="relative h-0 w-0 lg:h-full lg:w-1/2">
            <img src={require("../assets/home.jpg")} />
          </div>
        </div>
      </div>
    );
};

export default CarbonFootprintCalculatorVehicle;
