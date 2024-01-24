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

export const Flight = () => {
  const [flightClass, setFlightClass] = useState("economy"); // Default to economy class
  const [flightHours, setFlightHours] = useState("");
  const [username, setUsername] = useState("");
  const [flightCarbonFootprint, setFlightCarbonFootprint] = useState(null);

  const navigate = useNavigate();

  const handleFlightClassChange = (value) => {
    setFlightClass(value);
  };

  const handleFlightHoursChange = (value) => {
    setFlightHours(value);
  };

  const saveFlightDetails = async () => {
    const totalFootprint = calculateFlightCarbonFootprint(
      flightClass,
      parseFloat(flightHours)
    );

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const userEmail = sessionStorage.getItem("User Email");
    const userQuery = query(usersCollection, where("email", "==", userEmail));

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

        // Use consumptionFlight as the document id
        const consumptionFlightRef = doc(currentMonthRef, "consumptionFlight");

        const newFlightDetails = {
          flightClass,
          flightHours: parseFloat(flightHours),
          flightCarbonFootprint: totalFootprint,
          timestamp: new Date().toISOString(),
        };

        try {
          await setDoc(consumptionFlightRef, newFlightDetails);
          setFlightCarbonFootprint(totalFootprint);
          console.log(
            "Flight details saved to Firestore for the current month"
          );
          //          navigate('/home');
        } catch (error) {
          console.error("Error saving flight details to Firestore:", error);
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
  };

  // Function to calculate flight carbon footprint based on class and hours
  const calculateFlightCarbonFootprint = (classType, hours) => {
    switch (classType) {
      case "economy":
        return 90 * hours;
      case "business":
        return 270 * hours;
      case "first":
        return 810 * hours;
      default:
        return 0;
    }
  };

  return (
    <div>
      <h1>Flight Details</h1>
      <div>
        <label>Flight Class:</label>
        <select
          value={flightClass}
          onChange={(e) => handleFlightClassChange(e.target.value)}
        >
          <option value="economy">Economy</option>
          <option value="business">Business</option>
          <option value="first">First Class</option>
        </select>
      </div>
      <div>
        <label>Flight Hours:</label>
        <input
          type="number"
          value={flightHours}
          onChange={(e) => handleFlightHoursChange(e.target.value)}
        />
      </div>
      <div>
        {flightCarbonFootprint !== null && (
          <div>
            <h2>Total Flight Carbon Footprint:</h2>
            <p>{flightCarbonFootprint} KgCO2</p>
          </div>
        )}
      </div>
      <button type="button" onClick={saveFlightDetails}>
        Save Flight Details
      </button>

    </div>
  );
};

export default Flight;
