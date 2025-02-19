import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Header from "./common/Header";
import { app } from "../firebaseconfig";
import "./common/Tailwind.css";
import { toast } from 'react-toastify';
import StarRating from "./common/StarRating";

export default function Feedback() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [productIdeaRating, setProductIdeaRating] = useState(0);
  const [productComfortRating, setProductComfortRating] = useState(0);
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [missingFeatures, setMissingFeatures] = useState("");
  const [improvementNotes, setImprovementNotes] = useState("");
  const [informationClarity, setInformationClarity] = useState("");
  const [encounteredBugs, setEncounteredBugs] = useState("");
  const [valuableFeatures, setValuableFeatures] = useState("");
  const [appUsage, setAppUsage] = useState("");
  const [additionalExperience, setAdditionalExperience] = useState("");

  useEffect(() => {
    const userEmail = sessionStorage.getItem("User Email");
    const username = sessionStorage.getItem("Username");
    setUsername(username);

    if (!userEmail) {
      navigate("/login"); // Redirect to login if user email is not found
      return;
    }
  }, [navigate]);

  const handleFeedbackSubmission = async () => {
    const db = getFirestore();
    const feedbackDocRef = doc(db, "Feedback", username);

    // Create a new document with the user's feedback
    await setDoc(feedbackDocRef, {
      productIdeaRating,
      productComfortRating,
      recommendationRating,
      missingFeatures,
      improvementNotes,
      informationClarity,
      encounteredBugs,
      valuableFeatures,
      appUsage,
      additionalExperience,
    });
    toast.success('Feedback submitted successfully');
    
    // Optionally, you can redirect the user or show a confirmation message
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center py-6">
        <h1 className="text-center w-[90%] flex flex-wrap w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
          Let us know your Feedback, {username}!
        </h1>
      </div>

      <div className="mt-[4%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">How do you like our product's idea :</span>
        <StarRating onRate={(rating) => setProductIdeaRating(rating)} />
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">How likely are you to recommend this product to others?</span>
        <StarRating onRate={(rating) => setRecommendationRating(rating)} />
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">How could we improve our product to better meet your needs?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setImprovementNotes(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">How would you rate the comfort of our webapp?</span>
        <StarRating onRate={(rating) => setProductComfortRating(rating)} />
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">Is the information provided by the app clear and informative? Are there any specific types of information you feel are lacking?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setInformationClarity(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">Have you encountered any bugs or issues while using the app? If yes, please describe.</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setEncounteredBugs(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">Which features of the app do you find most valuable/useful?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setValuableFeatures(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">Are there any additional features you would like to see implemented?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setMissingFeatures(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">How often do you use our app? What motivates you to use our app regularly?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setAppUsage(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mt-[8%] flex flex-col items-center lg-[10%] sm:mt-[2.5%]">
        <span className="text-center w-[85%]">Is there anything else you would like to share about your experience with our app?</span>
        <div className="w-[80%] lg:w-[40%]">
          <textarea
            id="ImprovementNotes"
            className="mt-[5%] w-full rounded-lg border-gray-200 border-solid border-b-2 align-top shadow-sm sm:text-sm mx-auto"
            rows="3"
            placeholder="Enter any additional notes..."
            onChange={(e) => setAdditionalExperience(e.target.value)}
          ></textarea>
        </div>
      </div>


      <div className="mt-[8%] flex flex-col items-center sm:mt-[2.5%]">
        <button
          onClick={handleFeedbackSubmission}
          className="flex flex-row items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit Feedback
        </button>
      </div>

      <br />
    </div>
  );
}
