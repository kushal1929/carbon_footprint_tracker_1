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
          await calculateAndStoreTotal(
            currentMonthRef,
            currentMonthYear,
            userDocRef
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

  const calculateAndStoreTotal = async (
    currentMonthRef,
    currentMonthYear,
    userDocRef
  ) => {
    const totalDocRef = collection(userDocRef, "Total");
    const totalMYDocRef = doc(totalDocRef, currentMonthYear);

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
        totalHome +
        totalFood +
        totalVehicle +
        totalFlight +
        totalPublicVehicle +
        totalExpenditure,
      timestamp: new Date(),
    };

    try {
      await setDoc(totalMYDocRef, totalDocData);
      console.log(
        "Total carbon footprint data saved to Firestore for the current month ",
        totalDocData
      );
    } catch (error) {
      console.error(
        "Error saving total carbon footprint data to Firestore:",
        error
      );
      alert(error.message);
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
    <div className="w-[90%] flex flex-col items-center py-10 mx-[5vw]">
      <div className="w-full pt-5 text:black bg-white font-extrabold sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center">
        Flight Details
      </div>

      <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
        <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
          <div className="flex flex-wrap flex-row items-center mb-4">
            <span htmlFor="flightClass" className="mr-2 font-medium">
              Flight Class:
            </span>

            <select
              id="flightClass"
              value={flightClass}
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => handleFlightClassChange(e.target.value)}
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>

          <div className="flex flex-wrap flex-row items-center mb-4">
            <span className="mr-2 font-medium">Flight Hours:</span>
            <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
              <input
                type="number"
                value={flightHours}
                placeholder="In hrs"
                className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                onChange={(e) => handleFlightHoursChange(e.target.value)}
              />
            </label>
          </div>

          <br />

          <button type="button" onClick={saveFlightDetails}>
            <a className="group inline-block rounded bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
              <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                Calculate
              </span>
            </a>
          </button>

          <br />

          <div>
            {flightCarbonFootprint !== null && (
              <div className="text-xl font-bold mb-4">
                <p>Total Flight Carbon Footprint:</p>
                <p>{flightCarbonFootprint} KgCO2</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative h-0 w-0 lg:h-full lg:w-1/2">
          <img src={require("../assets/home.jpg")} />
        </div>
      </div>
    </div>
  );
};

export default Flight;
