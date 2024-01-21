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
    const [vehicleMPG, setVehicleMPG] = useState('');
    const [vehicleFuel, setVehicleFuel] = useState("Petrol");
    const [vehicleDistance_car, setVehicleDistance_car] = useState('');
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
        const emission_factor = 0.2;
        const kmpl_to_mpg=2.35;
        const km_to_miles=0.62137;

        let vehicleCarbonFootprint_car = 0;
        let vehicleCarbonFootprint_motorcycle = 0;

        let vehicleCarbonFootprint = 0;
        if (vehicleFuel === "Petrol") {
            vehicleCarbonFootprint_car =(1/ vehicleMPG/kmpl_to_mpg) * FuelFactor_Petrol * vehicleDistance_car*km_to_miles;
        } 
        else if (vehicleFuel === "Diesel"){
            vehicleCarbonFootprint_car =(1 / vehicleMPG/kmpl_to_mpg) * FuelFactor_Diesel * vehicleDistance_car*km_to_miles;
        }

        vehicleCarbonFootprint_motorcycle = vehicleDistance_motorcycle * emission_factor;
        const totalVehicleCarbonFootprint =vehicleCarbonFootprint_car + vehicleCarbonFootprint_motorcycle;

        setVehicleCarbonFootprint(totalVehicleCarbonFootprint);
        calculateCarbonFootprintVehicle(totalVehicleCarbonFootprint);
    };

    
    return (
      <div>
        <h1>Private Vehicle CarbonFootPrint</h1>
        <label>
          Enter mileage in Km/L consumed:
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
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </select>
        </label>
        <br />
        <label>
          Distance Traveled(in km) by car:
          <input
            type="number"
            value={vehicleDistance_car}
            onChange={(e) => setVehicleDistance_car(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Distance Traveled(in km) by motorcycle:
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
