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
import Header from "./common/Header";
import "./common/Tailwind.css";
import { prompt1send } from "./Prompt1";

export default function ActionPlan(){

    const [userData, setUserData] = useState([]);
    const [prompt1, setPrompt1] = useState([]);
    const [prompt1string, setPromptString] = useState('');
    const [prompt1Response, setPrompt1Response] = useState('');
    const navigate=useNavigate();

    useEffect(() => {

        const userEmail = sessionStorage.getItem("User Email");
        const username = sessionStorage.getItem("Username");
        if (!userEmail) {
          navigate("/login"); // Redirect to login if user email is not found
          return;
        }
        const fetchData = async () => {
            try {
              const db = getFirestore();
              const usersCollection = collection(db, 'users');
      
              // Get the current month and year
              const currentDate = new Date();
              const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
              
              console.log(username);
              console.log(currentMonthYear);
              // Replace 'username', currentMonth, and currentYear with the actual values
              const currentMonthDocs = await getDocs(collection(usersCollection, username, currentMonthYear));
      
              const userDataArray = [];
              currentMonthDocs.forEach((doc) => {
                // Access data in each document and add it to the array
                userDataArray.push({
                  id: doc.id,
                  data: doc.data(),
                });
              });
      
              // Set the state with the fetched data
              setUserData(userDataArray);

              const prompt1Data = userDataArray.filter((user) => user.id === 'consumptionFlight' || user.id === 'consumptionFood');
              const filteredPrompt1Data = prompt1Data.map((user) => {
                const { timestamp, ...filteredData } = user.data;
                for (const key in filteredData) {
                  if (key.includes('CarbonFootprint')) {
                    delete filteredData[key];
                  }
                }
                return { id: user.id, data: filteredData };
              });
      
              setPrompt1(filteredPrompt1Data);
              const formattedString = filteredPrompt1Data.map((user) => convertDataToString(user.data)).join('\n');
              setPromptString(formattedString);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
        }, []);

        useEffect(() => {
          const fetchResponse = async () => {
              try {
                  if (prompt1string !== '') {  // Add a conditional check
                      const resp = await prompt1send(prompt1string);
                      setPrompt1Response(resp);
                  }
              } catch (error) {
                  console.error('Error fetching response:', error);
              }
          };
      
          fetchResponse(); // Call the function immediately after setting prompt1string
      
      }, [prompt1string]); // Add prompt1string as a dependency to useEffect
      

        const convertDataToString = (dataObject) => {
          let result = '';
          for (const key in dataObject) {
            if (typeof dataObject[key] === 'object') {
              for (const nestedKey in dataObject[key]) {
                result += `${nestedKey}:${dataObject[key][nestedKey]}\n`;
              }
            } else {
              result += `${key}:${dataObject[key]}\n`;
            }
          }
          return result;
        };
        
        
  return (
    <>
    <Header/>
    <div>
      <h1>User Data for January 2024</h1>
      <pre>{prompt1Response}</pre>
      
    </div>
    </>
  );

}
