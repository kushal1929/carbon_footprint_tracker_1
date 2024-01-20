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

    const [LocalBus,setLocalBus] = useState();
    const [National_Rail,setNation_Rail]=useState();
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

    const handlePublicVehicleCalculate = ()=>{
        const LocalBus_Factor = 0.2;
        const National_Rail_Factor =0.07;

        const totalPublicVehicleCarbonFootprint = LocalBus*LocalBus_Factor + National_Rail_Factor*National_Rail;

        setPublicVehicleCarbonFootprint(totalPublicVehicleCarbonFootprint);
        calculateCarbonFootprintPublicVehicle(totalPublicVehicleCarbonFootprint);
    };

    return (
        <div>
            <h1>Public Vehicle CarbonFootPrint</h1>
            <label>
                Enter the distance covered in LocalBus(in miles):
                <input
                    type="number"
                    value={LocalBus}
                    onChange={(e)=>setLocalBus(Number(e.target.value))}
                />
            </label>
            <br/>
            <label>
                Enter the distance covered in National Rail(in miles):
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
            {calculateCarbonFootprintPublicVehicle}
        </div>
    );
};

export default CarbonFootprintCalculatorPublicVehicle;
