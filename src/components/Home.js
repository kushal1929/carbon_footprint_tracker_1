import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy, doc, getDoc, setDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./common/Header";
import Home_card from "./common/Home_card";
import RecyclingCentersMap from './RecyclingCentersMap';
import LeaderBoard from "./common/Leaderboard";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});
  const [averageTotalCarbonFootprint, setAverageTotalCarbonFootprint] = useState(null);

  const monthsRef = useRef([]);
  const totalCarbonFootprintValuesRef = useRef([]);

  const calculateAverageTotalCarbonFootprint = async (currentDate) => {
    const db = getFirestore();
    const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
    const averageDocRef = doc(db, 'Average', currentMonthYear);

      // Check if the average for the current month and year is already present
      const averageDoc = await getDoc(averageDocRef);
      if (averageDoc.exists()) {
        return averageDoc.data().averageTotalCarbonFootprint || 0;
      }
  
    if (currentDate.getDate() < 15) {
      try {
        const previousMonthYear = new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
        }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  
        const previousMonthAverageDocRef = doc(db, 'Average', previousMonthYear);
        const previousMonthAverageDoc = await getDoc(previousMonthAverageDocRef);
        // console.log('1');
        if (previousMonthAverageDoc.exists()) {
          // console.log('2');
          return previousMonthAverageDoc.data().averageTotalCarbonFootprint || 0;
        }
      } catch (error) {
        console.error('Error fetching previous month\'s average:', error);
      }
    }



    if(currentDate.getDate() >=15){
      console.log('3');
      const fetchAllUsernames = async () => {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
      
        try {
          const userDocs = await getDocs(usersCollection);
          
          const username_all = userDocs.docs.map((userDoc) => userDoc.id);
      
          console.log("All Usernames:", username_all);
      
          return username_all;
        } catch (error) {
          console.error("Error fetching usernames:", error);
          return [];
        }
      };
      
      // Call the function to fetch usernames
      const username_all = await fetchAllUsernames();
      console.log(username_all);
      try {
        const usersCollection = collection(db, 'users');
        let totalCarbonFootprintSum = 0;
        let totalUsers = 0;
        // Iterate through all usernames
      for (const username of username_all) {
        const userDocRef = doc(usersCollection, username, 'Total', currentMonthYear);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData && userData.totalCarbonFootprint) {
            totalCarbonFootprintSum += userData.totalCarbonFootprint || 0;
            totalUsers += 1;
          }
        }
      }

      const averageTotalCarbonFootprint = totalCarbonFootprintSum / (totalUsers || 1);
            // Fetch user data for the current month
    console.log(averageTotalCarbonFootprint);
  
        await setDoc(averageDocRef, {
          averageTotalCarbonFootprint,
        });
  
        return averageTotalCarbonFootprint;
      } catch (error) {
        console.error('Error calculating or storing average:', error);
      }
    }
  
    return 0;
  };
  
  const fetchAverage = async () => {
    try {
      const currentDate = new Date();
      console.log('currentDate:', currentDate);
  
      const average = await calculateAverageTotalCarbonFootprint(currentDate);
      setAverageTotalCarbonFootprint(average);
    } catch (error) {
      console.error('Error fetching average:', error);
    }
  };
  
  useEffect(() => {
    const userEmail = sessionStorage.getItem("User Email");

    if (!userEmail) {
      navigate("/login");
      return;
    }

    const db = getFirestore();
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("email", "==", userEmail));

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUsername(doc.id || "");
          });
        } else {
          console.log("User not found in Firestore");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error);
        setLoading(false);
      });
      fetchAverage();
  }, [navigate]);

  sessionStorage.setItem("Username", username);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchConsumptionData = async () => {
      try {
        const db = getFirestore();
        const consumptionDataCollection = collection(db, "users", username, "Total");
        const consumptionDataQuery = query(consumptionDataCollection, orderBy("timestamp", "asc"));
        const consumptionDataSnapshot = await getDocs(consumptionDataQuery);

        if (consumptionDataSnapshot.empty) {
          console.log("No matching documents for consumption data.");
        } else {
          const months = [];
          const totalCarbonFootprintValues = [];

          consumptionDataSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            const month = doc.id;
            const totalCarbonFootprint = data.totalCarbonFootprint;

            months.push(month);
            totalCarbonFootprintValues.push(totalCarbonFootprint);
            monthsRef.current.push(month);
            totalCarbonFootprintValuesRef.current.push(totalCarbonFootprint);
          });

          setChartData({
            labels: months,
            datasets: [
              {
                label: "Total Carbon Footprint",
                data: totalCarbonFootprintValues,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 2,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching consumption data:", error);
      }
    };

    fetchConsumptionData();
  }, [username]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <>
      <Header />
      <div className='flex justify-center py-6'>
        <h1
          className="w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
        >
          Welcome, {username}!
        </h1>
      </div>
      <div className="relative flex flex-wrap lg:h-3/5 lg:flex-start">
        <div className='flex justify-center items-center w-full lg:w-1/2 px-5 mt-5' >
          {chartData.labels && chartData.labels.length > 0 ? 
            (
            <Line data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels:{
                      boxHeight:20,
                      boxWidth:50,
                      padding:40,
                      font:{
                        size:20,
                      }
                    }
                  },
                },
              }} 
            />
            ) : (<p>No data available for chart</p>)
          }
        </div>
        <div className='flex flex-row place-content-evenly w-full lg:w-1/2 gap-x-6 px-3 place-content-evenly sm:place-content-evenly px-10 mt-10 mb-20 items-stretch justify-stretch'>
          <div
              class=" flex flex-col place-content-evenly w-[50%] block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-lime-300/20 mx-auto"
          >
              
              <h2 class="flex mt-[1%] text-center justify-center items-center w-full w-fit text-amber-400 bg-clip-text text-2xl font-extrabold text-amber-400 sm:text-3xl">Your Footprint Recently</h2>

              <div className="mt-[10%] text-gray-300 text-center  sm:text-xl">
              {monthsRef.current.length >= 3
                  ? monthsRef.current.slice(-3).map((month, index) => (
                  <>
                      <p className="mt-[2%] sm:mt-[5%] text-center text-emerald-700 sm:text-2xl" key={index}>{month}: {totalCarbonFootprintValuesRef.current.slice(-3)[index].toFixed(3)}</p>
                      <p className="text-xs">Kg CO2</p>
                  </>

                ))
                  : monthsRef.current.map((month, index) => (
                <>
                  <p className="mt-[2%] sm:mt-[5%] text-center text-emerald-700 sm:text-2xl" key={index}>{month}: {totalCarbonFootprintValuesRef.current[index].toFixed(3)}</p>
                  <p className="text-xs">Kg CO2</p>
                </>

              ))}
              </div>
          </div>
          <div
            className="flex flex-col place-content-evenly mx-auto w-[50%] block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-lime-300/20 "
          >
            <h2 class="flex mt-[1%] text-center justify-center items-center w-full w-fit text-amber-400 bg-clip-text text-2xl font-extrabold text-amber-400 sm:text-3xl">Average Footprint Across Globe</h2>
            <>
              <p className="font-bold mt-[20%] sm:mt-[10%] text-center text-emerald-700 text-[22px] sm:text-[40px]">
                {averageTotalCarbonFootprint !== null ? `${averageTotalCarbonFootprint.toFixed(3)}` : 'Loading...'}
              </p>
              <p className=" text-[15px] text-center text-gray-300 sm:text-[24px]">{averageTotalCarbonFootprint !== null ? 'Kg CO2' :''}</p>
              <p className=" text-[10px] text-center text-gray-300 sm:text-[15px]">{averageTotalCarbonFootprint !== null ? 'updates 15th of every month' :''}</p>
            </>

          </div>
        </div>
      </div>

    <div className='flex flex-col justify-start items-center w-full h-1/2 mt-5 720px:mt-[20%] lg:mt-[28%] xl:mt-[15%] 2xl:mt-[7.5%]' >
       <LeaderBoard/> 
    </div>

    </>
  );
}
