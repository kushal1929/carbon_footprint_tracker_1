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
  const [prompt2Response, setPrompt2Response] = useState('');
  const {prompt2string} = Prompt2fetchData();
  const {prompt1string} = Prompt1fetchData();
 

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        if (prompt1string!=='' && prompt2string!=='') {
          
          const [resp1, resp2] = await Promise.all([
            prompt1send(prompt1string),
            prompt2send(prompt2string)
          ]);

          setPrompt1Response(resp1);
          setPrompt2Response(resp2);

           // Reset the flag after requests are complete
        }
      } catch (error) {
        console.error('Error fetching responses:', error);
         // Reset the flag in case of an error
      }
    };

    fetchResponses();
  }, [prompt1string, prompt2string]);
      
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });      

  const prompt1array = prompt1Response.split(/\d+\./).filter(sentence => sentence.trim() !== '');
  const prompt2array = prompt2Response.split(/\d+\./).filter(sentence => sentence.trim() !== '');
  const totalArray = prompt1array.concat(prompt2array);

  const StringArrayRenderer = ({ stringArray }) => {
    return (
      <>
              {stringArray.map((str, index) => (
                
            <a
            className="block rounded-xl border border-gray-200 p-8 shadow-xl transition hover:border-lime-300/10 hover:shadow-lime-300/20"
          >

            <h2 className="mt-4 text-xl font-bold text-black">{index+1}.</h2>
              <div className="mt-1 text-sm text-black" key={index}>{str}</div>
            
            
          </a>
              ))}
             
      </>
    );
  };

  return (
    <>
    <Header/>
    <div>
      <section className="bg-white text-black">
        <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-[10%] lg:py-16">
          <div className="mx-auto max-w-lg text-center">
          <h1 className="w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Your Action Plan</h1>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
           
          <StringArrayRenderer stringArray={totalArray} />
            
          </div>

        </div>
      </section>
      
    </div>
    </>
  );

}
