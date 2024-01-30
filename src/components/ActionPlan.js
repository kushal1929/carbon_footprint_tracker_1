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
import { prompt2send } from "./Prompt2";
import { Prompt1fetchData } from "./Prompt1";
import { Prompt2fetchData } from "./Prompt2";

export default function ActionPlan(){

  const [prompt1Response, setPrompt1Response] = useState('');
  const {prompt1string} = Prompt1fetchData();
  const [prompt2Response, setPrompt2Response] = useState('');
  const {prompt2string} = Prompt2fetchData();

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
      
    fetchResponse(); 
      
  }, [prompt1string]); 

  useEffect(() => {
    const fetchResponse = async () => {
      try {
            if (prompt2string !== '') {  // Add a conditional check
              const resp = await prompt2send(prompt2string);
              setPrompt2Response(resp);
            }
          } catch (error) {
             console.error('Error fetching response:', error);
          }
    };
      
    fetchResponse();
      
  }, [prompt2string]); 
        
        
  return (
    <>
    <Header/>
    <div>
      <h1>User Data for January 2024</h1>
      <pre>{prompt1Response}</pre>
      <pre>{prompt2Response}</pre>
      
    </div>
    </>
  );

}
