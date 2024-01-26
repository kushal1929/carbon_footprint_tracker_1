import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { app } from "../firebaseconfig";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./common/Header";
import Home_card from "./common/Home_card";
import "./common/Tailwind.css";
import RecyclingCentersMap from './RecyclingCentersMap';


export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});


  useEffect(() => {
    const userEmail = sessionStorage.getItem("User Email");

    if (!userEmail) {
      navigate("/login"); // Redirect to login if user email is not found
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
        const consumptionDataCollection = collection(
          db,
          "users",
          username,
          "Total"
        );
        const consumptionDataQuery = query(
          consumptionDataCollection,
          orderBy("timestamp", "asc")
        );
        const consumptionDataSnapshot = await getDocs(consumptionDataQuery);

        if (consumptionDataSnapshot.empty) {
          console.log("No matching documents for consumption data.");
        } else {
          const months = [];
          const totalCarbonFootprintValues = [];

          consumptionDataSnapshot.docs.forEach((doc) => {
            //console.log(doc.id);
            //console.log(doc.data());
            const data = doc.data();
            const month = doc.id; // Assuming the document ID is the month
            const totalCarbonFootprint = data.totalCarbonFootprint;

            months.push(month);
            totalCarbonFootprintValues.push(totalCarbonFootprint);
            console.log(months);
            console.log(totalCarbonFootprintValues);
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
      <div className='flex flex-row items-start w-full lg:w-1/2 gap-x-6 px-3 sm:px-10 mt-10 mb-20 items-stretch justify-stretch '>
        <Home_card/>
        <Home_card/>
      </div>
    </div>

    <div className="relative flex flex-wrap lg:h-3/5 lg:flex-start">
      <div className='flex justify-center items-center w-full lg:w-1/2 px-5 mt-5' >
      {/* {chartData.labels && chartData.labels.length > 0 ? 
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
      } */}
      </div>
      <div className='flex flex-col items-start w-full lg:w-1/2 gap-x-6 px-10 mt-10 mb-20 items-stretch '>
      <div className='flex justify-center items-center w-full w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-2xl'>Recycling Centers near you !</div>
      <div className="flex justify-center items-center w-full lg:w-full px-5 mt-5">
        <RecyclingCentersMap />
      </div>
      </div>
    </div>

      

      
    </>
  );
}
