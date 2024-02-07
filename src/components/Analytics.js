// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Header from './common/Header';
import { useNavigate } from "react-router-dom";
import {Chart, Title, Legend} from "chart.js/auto"
import { getFirestore, collection, doc, getDocs, getDoc } from 'firebase/firestore';

Chart.register(Title, Legend);
const Analytics = () => {
    const navigate=useNavigate();
    const [chartData, setChartData] = useState({});
    const [analyticsChartData, setUserChartData] = useState({});


    useEffect(() => {
      const userEmail = sessionStorage.getItem("User Email");
      const username = sessionStorage.getItem("Username");
  
      if (!userEmail || !username) {
        navigate("/login"); // Redirect to login if user email is not found
        return;
        // Redirect to login if user email or username is not found
        // You might need to handle the navigation logic based on your routing mechanism
        
      }

      
    
  
      const fetchConsumptionData = async () => {
        try {
          // Get the current month and year
          const currentDate = new Date();
          const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
          const db = getFirestore();
          const monthCollection = collection(db, "users", username, currentMonthYear);
          const consumptionExpenditureDocRef = doc(monthCollection, 'consumptionExpenditure');
  
          const docSnapshot = await getDoc(consumptionExpenditureDocRef);
  
          let filteredFieldsArray = [];
          let filteredValuesArray = [];
  
          if (docSnapshot.exists) {
            console.log("docSnapsot exists old",docSnapshot)
            const docData = docSnapshot.data();
            
            // Filter out specific fields
            filteredFieldsArray = Object.keys(docData).filter(field => field !== 'timestamp' && field !== 'ExpenditureCarbonFootprint');
            filteredValuesArray = filteredFieldsArray.map(field => docData[field]);
            console.log(filteredFieldsArray);
            console.log(filteredValuesArray);
          } else {
            console.log('Document not found ');
          }
  
          setChartData({
            labels: filteredFieldsArray,
            datasets: [
              {
                label: 'Expenditure Analysis',
                data: filteredValuesArray,
                backgroundColor: [
                  'rgb(166, 206, 227)',
                  'rgb(31, 120, 180)',
                  'rgb(178, 223, 138)',
                  'rgb(51, 160, 44)',
                  'rgb(251, 154, 153)',
                  'rgb(227, 26, 28)',
                  'rgb(253, 191, 111)',
                  'rgb(255, 127, 0)',
                  'rgb(202, 178, 214)',
                  'rgb(106, 61, 154)',
                  'rgb(255, 255, 153)',
                  'rgb(177, 89, 40)',
              ],
              
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };


      const fetchUserChartData = async () => {

        try {
          // Get the current month and year
          const currentDate = new Date();
          const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const db = getFirestore();
        const monthCollection = collection(db, "users", username, currentMonthYear);

        const paths = [
          'consumptionExpenditure/ExpenditureCarbonFootprint',
          'consumptionFlight/FlightCarbonFootprint',
          'consumptionFood/foodCarbonFootprint',
          'consumptionHome/homeCarbonFootprint',
          'consumptionPublicvehicle/PublicVehicleCarbonFootprint',
          'consumptionvehicle/vehicleCarbonFootprint',
        ];

        const fieldsArray = ['Expenditure', 'Flight', 'Food', 'Home', 'Public Vehicle', 'Vehicle'];
        const valuesArray = [];

        for (const path of paths) {
          const [collectionName, fieldName] = path.split('/');
          const docRef = doc(monthCollection, collectionName);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists) {
            const docData = docSnapshot.data();
            const value = docData[fieldName];

            valuesArray.push(value);
          } else {
            console.log(`${collectionName} document not found`);
            valuesArray.push(null);
          }
        }

        setUserChartData({
          title: {
            text: 'Your Total Carbon Footprint',
          },
          labels: fieldsArray,
          datasets: [
            {
              data: valuesArray,
              backgroundColor: [
                'rgb(254, 235, 226)',
                'rgb(252, 197, 192)',
                'rgb(250, 159, 181)',
                'rgb(247, 104, 161)',
                'rgb(197, 27, 138)',
                'rgb(122, 1, 119)',
            ],
            
            
            
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    

  };
      
     
      fetchUserChartData();
      fetchConsumptionData();
      
    }, []);
  

    
 
    const option1 = {
        
        plugins: {
          title: {
            display: true,
            text: "Expenditure Analysis",
            position: 'top',
            font:{
              size:30,
            }
          },
          legend: {
            position: 'bottom',
            labels:{
              boxHeight:5,
              boxWidth:10,
              padding:20,
              font:{
                size:15,
              }
            }
          },
        },
      
      maintainAspectRatio: true, // Disables aspect ratio constraints
      
    };

    const option2 = {
        
      plugins: {
        title: {
          display: true,
          text: "Total Carbon Footprint",
          position: 'top',
          font:{
            size:30,
          }
        },
        legend: {
          position: 'bottom',
          labels:{
            boxHeight:10,
            boxWidth:10,
            padding:20,
            font:{
              size:15,
            }
          }
        },
      },
    
    maintainAspectRatio: true, // Disables aspect ratio constraints
    
  };
   

          

  return (
    <>
    <Header/>
    
    
    <div className='h-full pb-20'>
    <div className='flex justify-center py-6 '>
      <h1
        className="px-4 text-center w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl"
      >
        Analyze your Carbon Footprint!

      </h1>
    </div>
    <div
      class="h-full justify-center mx-[5%] lg:mx-[15%] rounded bg-white">
    <div className="relative flex justify-center items-center flex-wrap lg:h-full lg:flex-start">

      <div className='flex items-center w-full h-4/5 lg:w-1/2 gap-x-6 px-3 lg:px-10 mt-10 mb-5 items-stretch justify-stretch' >
        
        {analyticsChartData.labels && analyticsChartData.labels.length > 0 ? 
          (
              
            <Doughnut data={analyticsChartData}
            
            height="200px"
            width="200px"
            options=
              {option2}
            
                
          
            
            />
          
          ): console.log(1)}
        </div>
    
        <div className='flex justify-center items-center w-full h-4/5 lg:w-1/2  px-5 mt-10 ' >
        
        {chartData.labels && chartData.labels.length > 0 ? 
        (
          
          <Doughnut data={chartData} 
          height="200px"
          width="200px"
          options=
            {option1}
          
              
        
          
          />
          
        ) : (<p
           className="w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent lg:text-xl">
            No data available for chart, please visit the <a href='/consumption-data' class="w-fit font-bold text-blue-600 underline dark:text-blue-500 hover:no-underline"> Carbon Footprint Calculator</a> to start your Carbon Footprint journey Today!</p>)}
        
     
      </div>
      
      
      </div>
      </div>
     </div>
    
    </>
  );
};

export default Analytics;

