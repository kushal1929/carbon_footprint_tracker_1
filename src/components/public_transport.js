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
import { FaQuestionCircle } from "react-icons/fa";

export const CarbonFootprintCalculatorPublicVehicle = () => {
  const [LocalBus, setLocalBus] = useState("");
  const [National_Rail, setNation_Rail] = useState("");
  let [PublicVehicleCarbonFootprint, setPublicVehicleCarbonFootprint] =
    useState(null);
  const [username, setUsername] = useState("");
  const [tooltipVisible1,setTooltipVisible1]=useState(false);

  const toggleTooltip1 = () => {
    setTooltipVisible1(!tooltipVisible1);
  };

  const handleLocalBus = (value) => {
    if (parseFloat(value) < 0) {
      alert("Distance traveled in local bus cannot be negative");
    } else {
      setLocalBus(value);
    }
  };

  const handleNationalRail = (value) => {
    if (parseFloat(value) < 0) {
      alert("Distance traveled in National Rail cannot be negative");
    } else {
      setNation_Rail(value);
    }
  };

  const db = getFirestore();
  const usersCollection = collection(db, "users");
  const navigate = useNavigate();

  const calculateCarbonFootprintPublicVehicle = async (
    PublicVehicleCarbonFootprint
  ) => {
    const newPublicVehicleData = {
      LocalBus,
      National_Rail,
      PublicVehicleCarbonFootprint,
      timestamp: new Date(),
    };

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

        // Use consumptionHome as the document id
        const consumptionPublicVehicleRef = doc(
          currentMonthRef,
          "consumptionPublicvehicle"
        );

        try {
          await setDoc(consumptionPublicVehicleRef, newPublicVehicleData);
          
          await calculateAndStoreTotal(
            currentMonthRef,
            currentMonthYear,
            userDocRef
          );
        } catch (error) {
          
          alert(error.message);
        }
      } else {
        
        alert("User not found in Firestore");
      }
    } catch (error) {
      
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
      
    } catch (error) {
      
      alert(error.message);
    }
  };

  const handlePublicVehicleCalculate = () => {
    const LocalBus_Factor = 0.2;
    const National_Rail_Factor = 0.07;
    const km_to_miles = 0.62137;

    const totalPublicVehicleCarbonFootprint =
      (LocalBus * LocalBus_Factor + National_Rail_Factor * National_Rail) *
      km_to_miles;

    setPublicVehicleCarbonFootprint(totalPublicVehicleCarbonFootprint);
    calculateCarbonFootprintPublicVehicle(totalPublicVehicleCarbonFootprint);
  };

  return (
    <div className="w-[90%] flex flex-col items-center py-10 mx-[5vw]">
      <div className="w-full pt-5 text:black bg-white font-extrabold text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center z-10">
        Carbon Footprint from Public Transport
      </div>

      <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
        <p className="w-full pt-5 text:black bg-white  sm:text-xl md:text-xl lg:text-xl xl:text-xl 2xl:text-xl text-center">
                  Note: Please fill in the details once a month
                  <FaQuestionCircle className="mx-auto"
                    onMouseEnter={toggleTooltip1}
                    onMouseLeave={toggleTooltip1}
                  />
                  {tooltipVisible1 && (
                    <div className="bg-white p-2 rounded shadow-lg z-10">
                      <div className="flex flex-col z-10">
                        <p className="text-xs">If you wish to update some values in the current month then you will have to update all the fields in the current screen.</p>
                      </div>
                    </div>
                  )}
            </p>
        <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
          <div className="flex flex-row items-center justify-center mb-4">
            <span className="mr-2 font-medium">Local Buses:</span>
            <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
              <input
                type="number"
                value={LocalBus}
                placeholder="Distance in km"
                className="block w-full border-0 rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                onChange={(e) => handleLocalBus(e.target.value)}
              />
            </label>
          </div>

          <br />

          <div className="flex flex-row items-center justify-center mb-4">
            <span className="mr-2 font-medium">National Rail:</span>
            <label className="relative w-1/2 sm:w-auto block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
              <input
                type="number"
                value={National_Rail}
                placeholder="Distance in km"
                className="block w-full border-0 rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
                onChange={(e) => handleNationalRail(e.target.value)}
              />
            </label>
          </div>

          <br />

          <button onClick={handlePublicVehicleCalculate}>
            <a className="group inline-block rounded bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
              <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                Calculate
              </span>
            </a>
          </button>
          <br />

          {PublicVehicleCarbonFootprint !== null && (
            <div className="text-xl font-bold mb-4">
              Your estimated vehicle carbon footprint is:{" "}
              {PublicVehicleCarbonFootprint.toFixed(3)} kgCO2 per month
            </div>
          )}
          {/* {calculateCarbonFootprintPublicVehicle} */}
        </div>

        <div className="flex lg:h-full w-0 lg:w-1/2 px-10 py-10">
          <img className="object-contain" src={require("../assets/public.jpg")}/>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintCalculatorPublicVehicle;
