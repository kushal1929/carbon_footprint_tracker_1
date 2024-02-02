import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FaQuestionCircle } from "react-icons/fa";
import "./common/Tailwind.css";

const EatingHabits = () => {
  const [username, setUsername] = useState("");
  const [foodCarbonFootprint, setFoodCarbonFootprint] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState({
    highMeatEater: 0,
    mediumMeatEater: 0,
    lowMeatEater: 0,
    fishEater: 0,
    vegetarian: 0,
    vegan: 0,
  });

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const handleDropdownChange = (question, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [question]: parseInt(value, 10),
    }));
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const saveEatingHabits = async () => {
    const totalSelected = Object.values(selectedOptions).reduce(
      (acc, value) => acc + value,
      0
    );

    if (totalSelected === 7) {
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

          // Use consumptionHome as the document id
          const consumptionFoodRef = doc(currentMonthRef, "consumptionFood");

          const newEatingHabit = {
            selectedOptions,
            foodCarbonFootprint: calculateTotalCarbonFootprint(selectedOptions),
            timestamp: new Date().toISOString(),
          };
          setFoodCarbonFootprint(newEatingHabit.foodCarbonFootprint);
          try {
            await setDoc(consumptionFoodRef, newEatingHabit);
            console.log(
              "Eating habits data saved to Firestore for the current month"
            );
            await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
            // navigate("/home");
          } catch (error) {
            console.error(
              "Error saving eating habits data to Firestore:",
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
    } else {
      alert("Please ensure the values add up to 7.");
    }
  };
  
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

  const calculateRemainingValue = () => {
    const totalSelected = Object.values(selectedOptions).reduce(
      (acc, value) => acc + value,
      0
    );
    return 7 - totalSelected;
  };

  // Function to display remaining days information
  const displayRemainingDaysInfo = () => {
    const remainingValue = calculateRemainingValue();
    if (remainingValue === 0) {
      return <div className="text-xl font-bold mb-4">All days are accounted for.</div>;
    } else if (remainingValue > 0) {
      return <div className="text-xl font-bold mb-4">{remainingValue} days need to be accounted for.</div>;
    } else {
      return <div className="text-xl font-bold mb-4">{Math.abs(remainingValue)} days need to be removed.</div>;
    }
  };

  const calculateTotalCarbonFootprint = (options) => {
    const {
      highMeatEater,
      mediumMeatEater,
      lowMeatEater,
      fishEater,
      vegetarian,
      vegan,
    } = options;

    const totalFootprint =
      42.42857 * highMeatEater +
      30 * mediumMeatEater +
      23.1428 * lowMeatEater +
      20.4285 * fishEater +
      18 * vegetarian +
      10.714285 * vegan;

    return totalFootprint;
  };
  //   const displaySelectedValues = () => {
  //     return (
  //       <div>
  //         <h2>Selected Values:</h2>
  //         <ul>
  //           {Object.entries(selectedOptions).map(([question, value]) => (
  //             <li key={question}>
  //               {question}: {value}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //   };

  return (
    <div className="w-[90%] flex flex-col items-center py-10 mx-[5vw]">
      <div className="w-full pt-5 text:black bg-white font-extrabold sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl text-center z-10">
        Eating Habits
      </div>
      <div className="flex flex-row items-center flex-wrap bg-white w-full h-[90%]">
        <div className="flex items-center flex-col w-full h-full lg:w-1/2 lg:mt-[1%] space-y-0 py-20">
          <div className="text-xl font-bold mb-4">
            In the current month,how many days a week were you
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
                    <p>High meat-eater:More than 100g per day</p>
                    <p>Medium meat-eater:Between 50g & 100g per day</p>
                    <p>Low meat-eater:Less than 50g per day</p>
                    <p>Some average weights:</p>
                    <ui>Rump steak-200g</ui>
                    <ui>Lamb chop-150g</ui>
                    <ui>Quarter pounder burger-114g</ui>
                    <ui>Chicken drumstick-85g</ui>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap flex-row items-center mb-4">
              <label className="mr-2 font-medium">High Meat-eater:</label>
              <select
                className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
                value={selectedOptions.highMeatEater}
                onChange={(e) =>
                  handleDropdownChange("highMeatEater", e.target.value)
                }
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap flex-row items-center mb-4">
            <label className="mr-2 font-medium">Medium Meat-eater:</label>
            <select
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedOptions.mediumMeatEater}
              onChange={(e) =>
                handleDropdownChange("mediumMeatEater", e.target.value)
              }
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div className="flex flex-wrap flex-row items-center mb-4">
            <label className="mr-2 font-medium">Low Meat-eater:</label>
            <select
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedOptions.lowMeatEater}
              onChange={(e) =>
                handleDropdownChange("lowMeatEater", e.target.value)
              }
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div className="flex flex-wrap flex-row items-center mb-4">
            <label className="mr-2 font-medium">Fish Eater:</label>
            <select
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedOptions.fishEater}
              onChange={(e) =>
                handleDropdownChange("fishEater", e.target.value)
              }
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div className="flex flex-wrap flex-row items-center mb-4">
            <label className="mr-2 font-medium">Vegetarian:</label>
            <select
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedOptions.vegetarian}
              onChange={(e) =>
                handleDropdownChange("vegetarian", e.target.value)
              }
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div className="flex flex-wrap flex-row items-center mb-4">
            <label className="mr-2 font-medium">Vegan:</label>
            <select
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium border border-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedOptions.vegan}
              onChange={(e) => handleDropdownChange("vegan", e.target.value)}
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <br />

          <div>
            {/* Display remaining days information */}
            {displayRemainingDaysInfo()}
          </div>

          <br />

          <div>
            {foodCarbonFootprint !== null && (
              <div className="text-xl font-bold mb-4">
                Total Food Carbon Footprint:{foodCarbonFootprint} KgCO2
              </div>
            )}
          </div>

          <button type="button" onClick={saveEatingHabits}>
            <a className="group inline-block rounded bg-gradient-to-r from-yellow-300 via-lime-300 to-green-300 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
              <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                Calculate
              </span>
            </a>
          </button>
        </div>

        <div className="flex lg:h-full w-0 lg:w-1/2 px-5 py-10">
          <img className="object-contain" src={require("../assets/food.jpg")}/>
        </div>
      </div>
    </div>
  );
};

export default EatingHabits;
