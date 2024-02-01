import React,{useState} from 'react';
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

export const CarbonFootprintCalculatorPublicVehicle = () => {

    const [LocalBus,setLocalBus] = useState('');
    const [National_Rail,setNation_Rail]=useState('');
    let [PublicVehicleCarbonFootprint,setPublicVehicleCarbonFootprint]=useState(null);
    const [username, setUsername] = useState("");

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const navigate = useNavigate();

    const calculateCarbonFootprintPublicVehicle = async(PublicVehicleCarbonFootprint)=>{
        const newPublicVehicleData = {
            LocalBus,
            National_Rail,
            PublicVehicleCarbonFootprint,
            timestamp:new Date(),
        };

        const userEmail = sessionStorage.getItem("User Email");
        const userQuery = query(
          usersCollection,
          where("email", "==", userEmail)
        );

        try {
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUsername(userDoc.id || "");

            const userDocRef = doc(usersCollection, userDoc.id);

            // Include year in the current month
            const currentDate = new Date();
            const currentMonthYear = currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            const currentMonthRef = collection(userDocRef, currentMonthYear);

            // Use consumptionHome as the document id
            const consumptionPublicVehicleRef = doc(
              currentMonthRef,
              "consumptionPublicvehicle"
            );

            try {
              await setDoc(consumptionPublicVehicleRef, newPublicVehicleData);
              console.log(
                "Carbon footprint data saved to Firestore for the current month ",
                newPublicVehicleData
              );
              await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
            } catch (error) {
              console.error(
                "Error saving carbon footprint data to Firestore:",
                error
              );
              alert(error.message);
            }
          } else {
            console.log("User not found in Firestore");
            alert("User not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data:", error.message);
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

    const handlePublicVehicleCalculate = ()=>{
        const LocalBus_Factor = 0.2;
        const National_Rail_Factor =0.07;
        const km_to_miles=0.62137;

        const totalPublicVehicleCarbonFootprint = (LocalBus*LocalBus_Factor + National_Rail_Factor*National_Rail)*km_to_miles;

        setPublicVehicleCarbonFootprint(totalPublicVehicleCarbonFootprint);
        calculateCarbonFootprintPublicVehicle(totalPublicVehicleCarbonFootprint);
    };

    return (
        <div>
            <h1>Public Vehicle CarbonFootPrint</h1>
            <label>
                Enter the distance covered in LocalBus(in km):
                <input
                    type="number"
                    value={LocalBus}
                    onChange={(e)=>setLocalBus(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the distance covered in National Rail(in km):
                <input
                    type="number"
                    value={National_Rail}
                    onChange={(e)=>setNation_Rail(Number(e.target.value))}
                />
            </label>
            <br/>
            <button onClick={handlePublicVehicleCalculate}>
                Calculate Public Vehicle CarbonFootPrint
            </button>
            <br/>
            {PublicVehicleCarbonFootprint !== null && (
            <p>
                Your estimated vehicle carbon footprint is: {PublicVehicleCarbonFootprint}{" "}
                kgCO2 per month
            </p>
            )}
            {/* {calculateCarbonFootprintPublicVehicle} */}
        </div>
    );
};

export default CarbonFootprintCalculatorPublicVehicle;
