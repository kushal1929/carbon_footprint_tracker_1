import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, orderBy, doc, getDoc, setDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./common/Header";
import LoadingSymbol from "./common/LoadingSymbol";
import { BsCalculator, BsShareFill  } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { GiTreeGrowth } from "react-icons/gi";
import './common/Tailwind.css';
import OneSignal from 'react-onesignal';

  
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
            // Reset the references to avoid duplicate values during each re-render
            monthsRef.current = [];
            totalCarbonFootprintValuesRef.current = [];

            // Populate the references with new data
            monthsRef.current = months;
            totalCarbonFootprintValuesRef.current = totalCarbonFootprintValues;

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
          className="w-fit bg-gradient-to-r from-orange-300 via-rose-300 to-pink-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
          style={{ paddingBottom: '10px' }}
        >
          Welcome, {username}!
        </h1>
      </div>
      <div className="flex flex-wrap flex-row gap-y-3 mb-2 w-full lg:flex-nowrap gap-x-3 px-3 place-content-evenly sm:place-content-evenly  items-stretch justify-stretch mt-5 720px:mt-[20%] lg:mt-[28%] xl:mt-[4%] 2xl:mt-[2.5%]">
      <div className="items-center flex flex-row place-content-evenly mx-auto w-[80%] block rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-amber-700/50 "
          style={{ marginTop: '-30px', backgroundColor: 'rgb(251, 191, 36)' }}>
        <a href="/consumption-data">
          <p className="text-md sm:text-2xl text-white animate-bounce">
          Fill in the calculator to get detailed analytics and a personalized action plan!
          </p>
        </a>
        <BsCalculator className="text-white h-full w-auto"/>
      </div>
      
    </div>
      <div className="relative flex flex-wrap lg:h-[75%] lg:flex-start" style={{ backgroundColor: '#FFFCF7',  }}>

        <div className='flex justify-center items-center w-full lg:w-1/2 px-5 mt-5' >
          {chartData.labels && chartData.labels.length > 0 ? 
            (
              <Line 
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxHeight: 20,
                      boxWidth: 50,
                      padding: 40,
                      font: {
                        size: 20,
                      },
                    },
                  },
                },
                elements: {
                  point: {
                    radius: 5, // Increase this value to make the dot bigger
                    backgroundColor: 'rgba(75, 192, 192, 1)', // Color of the data point
                    borderWidth: 2,
                    hoverRadius: 12, // Increase the size when hovered
                  },
                },
              }}
            />
            
            ) : (<p>No data available for chart</p>)
          }
        </div>
        <div className='flex flex-row place-content-evenly w-full  lg:w-1/2 gap-x-3 px-3 place-content-evenly sm:place-content-evenly px-10 mt-10 mb-20 items-stretch justify-stretch'>
        <div className="relative flex flex-col place-content-evenly w-[50%] h-full block rounded-xl border border-gray-200 shadow-xl transition duration-500 ease-in-out hover:border-lime-300/30 hover:shadow-lime-300/40 mx-auto overflow-hidden bg-[url('../../assets/carb.jpg')] bg-cover bg-center hover:bg-opacity-10 hover:backdrop-blur-md">
  <div className="flex flex-col justify-center items-center w-full h-full bg-white bg-opacity-15 backdrop-blur-lg rounded-xl p-8 transition ease-in-out duration-700 hover:bg-opacity-10 hover:backdrop-blur-none">
    {/* Small White Box for Text */}
    <div className="bg-white bg-opacity-80 p-4 rounded-md w-[80%] sm:w-[70%] md:w-[60%] lg:w-[80%]">
      <h2 className="flex mt-[1%] text-center justify-center items-center w-full text-amber-400 text-2xl font-extrabold sm:text-3xl">
        Your Footprint Recently
      </h2>

      <div className="mt-[10%] text-gray-800 text-center sm:text-xl">
        {monthsRef.current.length >= 3
          ? monthsRef.current.slice(-3).map((month, index) => (
              <div key={index}>
                <p className="mt-[2%] sm:mt-[5%] text-center text-emerald-700 sm:text-2xl">
                  {month}: {totalCarbonFootprintValuesRef.current.slice(-3)[index].toFixed(3)}
                </p>
                <p className="text-xs">Kg CO2</p>
              </div>
            ))
          : monthsRef.current.map((month, index) => (
              <div key={index}>
                <p className="mt-[2%] sm:mt-[5%] text-center text-emerald-700 sm:text-2xl">
                  {month}: {totalCarbonFootprintValuesRef.current[index].toFixed(3)}
                </p>
                <p className="text-xs text-black">Kg CO2</p>
              </div>
            ))}
      </div>
    </div>
  </div>
</div>

          <div className="relative flex flex-col place-content-evenly w-[50%] h-full block rounded-xl border border-gray-200 shadow-xl transition duration-500 ease-in-out hover:border-lime-300/30 hover:shadow-lime-300/40 mx-auto overflow-hidden bg-[url('../../assets/image_1.jpg')] bg-cover bg-center hover:bg-opacity-10 hover:backdrop-blur-md">
          <div className="flex flex-col justify-center items-center w-full h-full bg-white bg-opacity-15 backdrop-blur-lg rounded-xl p-8 transition ease-in-out duration-700 hover:bg-opacity-10 hover:backdrop-blur-none">
            <button
              onClick={() => navigate("/share-score")} // Replace with your scorecard route
              className="mt-6 w-[110%] rounded-lg bg-blue-500 py-4 text-white font-bold text-lg hover:bg-blue-600"

            >
              View Scorecard
            </button>
          </div>
        </div>

        </div>
        
      </div>
      <section class="bg-white text-black">
        <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

          <div class="mx-auto max-w-lg text-center">
            <h2 class="text-3xl font-bold sm:text-4xl text-emerald-900 hover:text-emerald-500 ">
                Key Features
            </h2>
          </div>

          <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Carbon Footprint Calculator
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Detailed monthly calculation based on lifestyle factors like
                transportation, energy use, and diet.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Personalized Sustainability Plan
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Tailored action plan to reduce carbon emissions, empowering
                users with achievable steps.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Interactive Map for Recycling Locations
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Locate nearby recycling facilities for convenient waste
                management.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">
                Competitive Leaderboards
              </h2>

              <p class="mt-1 text-sm text-black-300">
                Engage in friendly competition, track progress, and motivate
                peers through challenges and leaderboards.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">Weekly Targets</h2>

              <p class="mt-1 text-sm text-black-300">
                Users can set and act on weekly targets to reduce their carbon footprint.
              </p>
            </div>

            <div class="block rounded-xl border border-gray-200 p-8 shadow-xl shadow-green-900 transition hover:border-lime-300/10 hover:shadow-emerald-500 hover:shadow-lime-300/10">
              <h2 class="mt-4 text-xl font-bold text-black">Analytics</h2>

              <p class="mt-1 text-sm text-black-300">
                Users can monitor progress and gain insights into their
                sustainability journey through analytics.
              </p>
            </div>

            
          </div>
        </div>
      </section>
      <section>
      <div className="mx-auto max-w-screen-md px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="flex justify-center items-center"
          style={{
            background: 'green',
            maxWidth: '600px', // Set a fixed or smaller max width to make the box smaller
            marginTop:"-70px",
            margin: '0 auto', // Center the box horizontally
            borderRadius: '8px' // Optional: Rounded corners for better styling
          }}
        >
          <InfoCard
            heading="User-Friendly Interface"
            content="Our user-friendly interface ensures easy navigation and accessibility, making sustainability engaging."
          />
        </div>
      </div>

            </section>
    </>
    
  );
}
export function InfoCard({heading,content,url,color})
{
    return(
        <div className="flex flex-col justify-center">
            <div className={`bg-${color} p-8 md:p-8 lg:px-6 lg:py-10`}>
                <div className="mx-auto max-w-xl text-center">
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                    {heading}
                </h2>

                <p className="hidden text-white/90 sm:mt-4 sm:block">
                {content}
                </p>

                </div>
            </div>
           
        </div> 
    )
                        
}

