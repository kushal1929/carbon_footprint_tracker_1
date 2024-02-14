import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy, doc, getDoc, setDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./common/Header";
import Home_card from "./common/Home_card";
import RecyclingCentersMap from './RecyclingCentersMap';
import LeaderBoard from "./common/Leaderboard";
import LoadingSymbol from "./common/LoadingSymbol";
import { BsCalculator } from "react-icons/bs";

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});
  const [averageTotalCarbonFootprint, setAverageTotalCarbonFootprint] = useState(null);
  const [userRank, setUserRank] = useState(null);

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
        
        if (previousMonthAverageDoc.exists()) {
          
          return previousMonthAverageDoc.data().averageTotalCarbonFootprint || 0;
        }
      } catch (error) {
       
        alert('Error fetching previous month\'s average:', error.message);
      }
    }



    if(currentDate.getDate() >=15){
      
      const fetchAllUsernames = async () => {
        const db = getFirestore();
        const usersCollection = collection(db, "users");
      
        try {
          const userDocs = await getDocs(usersCollection);
          
          const username_all = userDocs.docs.map((userDoc) => userDoc.id);
      
         
      
          return username_all;
        } catch (error) {
          alert("Error fetching usernames:", error.message);
          return [];
        }
      };
      
      // Call the function to fetch usernames
      const username_all = await fetchAllUsernames();
      
      try {
        const usersCollection = collection(db, 'users');
        let totalCarbonFootprintSum = 0;
        let totalUsers = 0;
        let totalCarbonFootprint_rank=[];
        // Iterate through all usernames
      for (const username of username_all) {
        const userDocRef = doc(usersCollection, username, 'Total', currentMonthYear);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData && userData.totalCarbonFootprint) {
            totalCarbonFootprint_rank.push({ username: username, totalCarbonFootprint: userData.totalCarbonFootprint });
            totalCarbonFootprintSum += userData.totalCarbonFootprint || 0;
            totalUsers += 1;
          }
        }
      }

      // Sort usernames based on total carbon footprint in ascending order
      totalCarbonFootprint_rank.sort((a, b) => a.totalCarbonFootprint - b.totalCarbonFootprint);
      console.log(totalCarbonFootprint_rank);
      const leaderboardCollectionRef = collection(averageDocRef, "Leaderboard");
      totalCarbonFootprint_rank.forEach(async (user, index) => {
        const userDocRef = doc(leaderboardCollectionRef, user.username);
        await setDoc(userDocRef, { 
          rankCarbonFootprint: index + 1 ,
          totalUsers : totalUsers,
        });// Index starts from 0, so add 1 to get the rank
      });

      const averageTotalCarbonFootprint = totalCarbonFootprintSum / (totalUsers || 1);
            // Fetch user data for the current month
    
  
        await setDoc(averageDocRef, {
          averageTotalCarbonFootprint,
        });
  
        return averageTotalCarbonFootprint;
      } catch (error) {
       
        alert('Error calculating or storing average:', error.message)
      }
    }
  
    return 0;
  };

  const fetchAverage = async () => {
    try {
      const currentDate = new Date();
      
  
      const average = await calculateAverageTotalCarbonFootprint(currentDate);
      setAverageTotalCarbonFootprint(average);
    } catch (error) {
      alert('Error fetching average:', error.message)
    }
  };

  const fetchCarbonRank= async(current_username)=>{
    if(current_username!='')
    {
      try {
        const currentDate = new Date();
        
        
        const db=getFirestore();
        const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
        const leaderboardDocRef = doc(db,'Average',currentMonthYear,'Leaderboard',current_username);

          const leaderboardDoc = await getDoc(leaderboardDocRef);
          if(leaderboardDoc.exists()){
            const user_rank=leaderboardDoc.data().rankCarbonFootprint + "/"+ leaderboardDoc.data().totalUsers;
            // console.log(user_rank);
            return user_rank;
          }
          if (currentDate.getDate() < 15) {
            try {
              const previousMonthYear = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                year: 'numeric',
              }).format(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        
              const previousMonthRankDocRef = doc(db, 'Average', previousMonthYear,'Leaderboard',current_username);
              const previousMonthRankDoc = await getDoc(previousMonthRankDocRef);
              if(previousMonthRankDoc.exists()){
                const user_rank=previousMonthRankDoc.data().rankCarbonFootprint + "/"+ previousMonthRankDoc.data().totalUsers;
                // console.log(user_rank);
                return user_rank;
              }
            }
            catch(error){

            }
          }
      } catch (error) {
        // console.log("bruh"+current_username);
        // alert('Error fetching rank:', error.message)
      }
    }
    

  } 

  useEffect(()=>{
    const current_username =sessionStorage.getItem("Username");
    // console.log(current_username);
    fetchCarbonRank(current_username).then((rank) => setUserRank(rank));
  },[username]);
  
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
          navigate(`/verify-email/${userEmail}`);
          // console.log("User not found in Firestore");
        }
        setLoading(false);
      })
      .catch((error) => {
        
        alert("Error fetching user data:", error.message);
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
       
        await("Error fetching consumption data:", error.message);

      }
    };

    fetchConsumptionData();
  }, [username]);

  if (loading) {
    return(
      <>

        <div className="flex flex-col h-[90%] w-full justify-center items-center">
          <div className="text-3xl mb-6 text-black">Loading...</div>
           <LoadingSymbol type="spin" color="#000"/> 
        </div> 
        
      </>
    )
  }

  if (error) {
    return(
      <>
        <Header/>
        <div className="grid h-screen place-content-center bg-white px-4">
          <div className="text-black text-3xl">Oops! Looks like there was some error on our side. Please try again after some time.</div>
        </div>
      </>
    )
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
        <div className='flex flex-row place-content-evenly w-full  lg:w-1/2 gap-x-3 px-3 place-content-evenly sm:place-content-evenly px-10 mt-10 mb-20 items-stretch justify-stretch'>
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
            <h2 class="flex mt-[1%] text-center justify-center items-center w-full w-fit text-amber-400 bg-clip-text text-2xl font-extrabold text-amber-400 sm:text-3xl">Footprint Across Globe</h2>
            <>
              <p className="flex mt-[20%] text-center justify-center items-center w-full w-fit text-amber-400 bg-clip-text text-xl font-extrabold text-amber-400 sm:text-2xl">Average</p>
              <p className="font-bold mt-[5%] sm:mt-[1%] text-center text-emerald-700 text-[22px] sm:text-[40px]">
                {averageTotalCarbonFootprint !== null ? `${averageTotalCarbonFootprint.toFixed(3)}` : 'Loading...'}
              </p>
              <p className=" text-[15px] text-center text-gray-300 sm:text-[24px]">{averageTotalCarbonFootprint !== null ? 'Kg CO2' :''}</p>
              <p className="flex mt-[10%] text-center justify-center items-center w-full w-fit text-amber-400 bg-clip-text text-xl font-extrabold text-amber-400 sm:text-2xl">Your Global Rank</p>
              <p className="font-bold mt-[5%] sm:mt-[1%] text-center text-emerald-700 text-[22px] sm:text-[40px]">{userRank !== null ? `${userRank}`:''}</p>
              
              <p className=" text-[10px] text-center text-gray-300 sm:text-[15px]">{averageTotalCarbonFootprint !== null ? 'updates 15th of every month' :''}</p>
            </>

          </div>
        </div>
      </div>

    <div className="flex flex-wrap flex-row gap-y-3 place-content-evenly  mb-2 w-full lg:flex-nowrap gap-x-3 px-3 place-content-evenly sm:place-content-evenly px-10 items-stretch justify-stretch mt-5 720px:mt-[20%] lg:mt-[28%] xl:mt-[4%] 2xl:mt-[2.5%]">
      <div className="bg-amber-600 flex flex-row place-content-evenly mx-auto w-[80%] block rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-amber-700/50 ">
        <a href="/consumption-data">
          <p className="text-xl sm:text-2xl text-white animate-pulse">
          Fill in the calculator to get detailed analytics and a personalized action plan!
          </p>
        </a>
        <BsCalculator className="text-white h-full w-auto"/>
      </div>
      <div className="bg-amber-500 flex flex-col place-content-evenly mx-auto w-[80%] block rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-amber-600/50 ">
        <a href="/consumption-data">
          <p className="text-xl sm:text-2xl text-white ">
           Read our blog to understand what carbon footprint is and how it affects the world         
          </p>
        </a>
      </div>
      <div className="bg-amber-400 flex flex-col place-content-evenly mx-auto w-[80%] block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-amber-500/50 ">3</div>
      <div className="bg-amber-300 flex flex-col place-content-evenly mx-auto w-[80%] block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-amber-400/50 ">4</div>
    </div>

    <div className='flex flex-col justify-start items-center w-full h-1/2 mt-5 720px:mt-[20%] lg:mt-[28%] xl:mt-[15%] 2xl:mt-[7.5%]' >
       <LeaderBoard/> 
    </div>

    </>
  );
}
