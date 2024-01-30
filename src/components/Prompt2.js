// node --version # Should be >= 18
// npm install @google/generative-ai
import {geminiAPIkey} from "../APIkeys";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  orderBy,
} from "firebase/firestore";

export function Prompt2fetchData(){
  const [userData, setUserData] = useState([]);
    const [prompt2, setPrompt2] = useState([]);
    const [prompt2string, setPromptString] = useState('');
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

              const prompt2Data = userDataArray.filter((user) => ['consumptionvehicle', 'consumptionPublicvehicle','consumptionHome'].includes(user.id));
              const filteredPrompt2Data = prompt2Data.map((user) => {
                const { timestamp, ...filteredData } = user.data;
                for (const key in filteredData) {
                  if (key.includes('CarbonFootprint')) {
                    delete filteredData[key];
                  }
                }
                return { id: user.id, data: filteredData };
              });
      
              setPrompt2(filteredPrompt2Data);
              const formattedString = filteredPrompt2Data.map((user) => convertDataToString(user.data)).join('\n');
              setPromptString(formattedString);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
        }, []);

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
        
        return {prompt2string};


}




export function prompt2send(prompt2string){
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const MODEL_NAME = "gemini-pro";
  const API_KEY = geminiAPIkey;
  
  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1024,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    console.log(prompt2string);
    const parts = [
      {text: "The input is a user's monthly Information about the distance covered in private/public transport and resources used at home in kgs or kwh.As an environmentalist, compare the values with the recommended values and create a personalized action plan the user can take to reduce their carbon footprint based on this data.Do not mention any absolute numeric value."},
      {text: `input:${prompt2string} `},
      {text: "output: "},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
    return(response.text());
  }
  
  const response = run();
  return(response);
}


