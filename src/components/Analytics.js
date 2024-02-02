// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Header from './common/Header';

import { getFirestore, collection, doc, getDocs, getDoc } from 'firebase/firestore';

const Analytics = () => {
    const [chartData, setChartData] = useState({});
  
    useEffect(() => {
      const userEmail = sessionStorage.getItem("User Email");
      const username = sessionStorage.getItem("Username");
  
      if (!userEmail || !username) {
        // Redirect to login if user email or username is not found
        // You might need to handle the navigation logic based on your routing mechanism
        return;
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
            const docData = docSnapshot.data();
  
            // Filter out specific fields
            filteredFieldsArray = Object.keys(docData).filter(field => field !== 'timestamp' && field !== 'ExpenditureCarbonFootprint');
            filteredValuesArray = filteredFieldsArray.map(field => docData[field]);
            console.log(filteredFieldsArray);
            console.log(filteredValuesArray);
          } else {
            console.log('Document not found');
          }
  
          setChartData({
            labels: filteredFieldsArray,
            datasets: [
              {
                label: 'Consumption Expenditure',
                data: filteredValuesArray,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
                  'rgba(54, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(54, 206, 86, 0.6)',
                  'rgba(255, 99, 86, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(54, 99, 86, 0.6)',
                  'rgba(255, 206, 86, 0.6)', 'rgba(54, 206, 86, 0.6)', 'rgba(255, 99, 86, 0.6)',
                  'rgba(54, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                ],
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchConsumptionData();
    }, []);
  
 
  

          

  return (
    <div>
        <Header/>
      <h1>Carbon Emission Analytics</h1>
      <div>
        <h2>Total Carbon Footprint</h2>
        
        {chartData.labels && chartData.labels.length > 0 ? 
        (
            <Doughnut data={chartData} />
        ) : (<p>No data available for chart</p>)}
      </div>
     
    </div>
  );
          };

export default Analytics;
