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

export const CarbonFootprintCalculatorVehicle = () => {
    const [vehicleMPG, setVehicleMPG] = useState(0);
    const [vehicleFuel, setVehicleFuel] = useState(0);
    const [vehicleDistance_car, setVehicleDistance_car] = useState(0);
    const [vehicleDistance_motorcycle, setVehicleDistance_motorcycle] =useState(0);
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
    const handleVehicleCalculate = () => {
        // Calculate vehicle carbon footprint based on the selected vehicle type
        const FuelFactor_Petrol = 2.31;
        const FuelFactor_Diesel = 2.68;
        const emission_factor = 0.5;

        let vehicleCarbonFootprint_car = 0;
        let vehicleCarbonFootprint_motorcycle = 0;

        let vehicleCarbonFootprint = 0;
        if (vehicleFuel === "Petrol") {
        vehicleCarbonFootprint_car =(1 / vehicleMPG) * FuelFactor_Petrol * vehicleDistance_car;
        } 
        else if (vehicleFuel === "Diesel"){
            vehicleCarbonFootprint_car =(1 / vehicleMPG) * FuelFactor_Diesel * vehicleDistance_car;
        }

        vehicleCarbonFootprint_motorcycle = vehicleDistance_motorcycle * emission_factor;
        const totalVehicleCarbonFootprint =vehicleCarbonFootprint_car + vehicleCarbonFootprint_motorcycle;

        setVehicleCarbonFootprint(totalVehicleCarbonFootprint);
        calculateCarbonFootprintVehicle(totalVehicleCarbonFootprint);
    };

    return (
      <div>
        <h1>Carbon Footprint Calculator {username}</h1>
        <label>
          Enter MPG consumed:
          <input
            type="number"
            value={vehicleMPG}
            onChange={(e) => setVehicleMPG(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Select Fuel Type:
          <select
            value={vehicleFuel}
            onChange={(e) => setVehicleFuel(e.target.value)}
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>
        </label>
        <br />
        <label>
          Distance Traveled(in miles) by car:
          <input
            type="number"
            value={vehicleDistance_car}
            onChange={(e) => setVehicleDistance_car(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Distance Traveled(in miles) by motorcycle:
          <input
            type="number"
            value={vehicleDistance_motorcycle}
            onChange={(e) =>
              setVehicleDistance_motorcycle(Number(e.target.value))
            }
          />
        </label>
        <br />
        <button onClick={handleVehicleCalculate}>
          Calculate Vehicle Footprint
        </button>
        <br />
        {vehicleCarbonFootprint !== null && (
          <p>
            Your estimated vehicle carbon footprint is: {vehicleCarbonFootprint}{" "}
            kgCO2 per month
          </p>
        )}
        {calculateCarbonFootprintVehicle}
      </div>
    );
};

export default CarbonFootprintCalculatorVehicle;
