import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import './Tailwind.css';
import Header from './Header';
import LoadingSymbol from "./LoadingSymbol";

const UserDataCard = () => {
  const [userData, setUserData] = useState(null);
  const [username,setUsername] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the username from session storage
        const username = sessionStorage.getItem('Username');
        setUsername(username);

        // Fetch carbon score and global rank from Firestore
        const db = getFirestore();
        const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
        
        // Fetch carbon score from users/{username}/Total/{currentMonthYear}
        const userDocRef = doc(db, 'users', username, 'Total', currentMonthYear);
        const userDocSnapshot = await getDoc(userDocRef);
        const carbonScore = userDocSnapshot.exists() ? userDocSnapshot.data().totalCarbonFootprint : 0.000;

        // Fetch global rank from Average/{currentMonthYear}/Leaderboard/{username}
        const leaderboardDocRef = doc(db, 'Average', currentMonthYear, 'Leaderboard', username);
        const leaderboardDocSnapshot = await getDoc(leaderboardDocRef);
        const rankCarbonFootprint = leaderboardDocSnapshot.exists() ? leaderboardDocSnapshot.data().rankCarbonFootprint : 'Unranked';
        const totalUsers = leaderboardDocSnapshot.exists() ? leaderboardDocSnapshot.data().totalUsers : '';
        const globalRank = rankCarbonFootprint !== 'Unranked'? `${rankCarbonFootprint}`:`${rankCarbonFootprint}`;

        // Set the user data state
        setUserData({ username, carbonScore, globalRank });

        // Call the downloadImage function after fetching user data
        // downloadImage(username);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, []);

  const downloadImage = (username) => {
    if (cardRef.current) {
      // Use html2canvas to capture the component as a canvas
      html2canvas(cardRef.current).then((canvas) => {
        // Convert the canvas to a data URL
        const imageDataURL = canvas.toDataURL('image/jpeg');

        // Create a temporary anchor element
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataURL;
        downloadLink.download = username+".jpg";

        // Simulate a click on the anchor element to trigger the download
        downloadLink.click();
      });
    }
  };

  return (
    <>
    <Header/>
    <div className='h-full w-full flex flex-col items-center mt-10 sm:mt-0 justify-start sm:justify-center'>
      {userData ? (
        <>
        <div className="w-[90vw] h-[105vw] sm:h-3/5 pt-1 sm:w-[65vh] md:w-[70vh] bg-cover bg-[url('../../assets/image_1.jpg')]" ref={cardRef}>
            <div className="relative flex items-center h-[90%] w-[92%] m-[4%] rounded-[66px] bg-white pt-[5%]">
              <div className="relative w-full h-full flex flex-col items-center ">
                <div className='h-[10%] mb-[2%]'>
                  <img 
                    src={require("../../assets/Ecolibrium_Logo.png")}
                    className='h-full'      
                  />
                </div>
                <div className='font-PJSbold text-[6vw] sm:text-[5vh] mb-[4%]'>
                  Amazing {userData.username} !
                </div>
                <div className='font-WorkSans text-[6vw] mb-[2%] sm:text-[4vh] mb-[4%]'>
                  Stats this month
                </div>
                <div className='flex flex-row'>
                  <div className='font-WorkSans text-[5vw] sm:text-[3vh] mb-[4%]'>
                    Carbon Footprint: {userData.carbonScore.toFixed(3)} 
                  </div>
                  <div className='font-WorkSans text-[3vw] mt-[2.25%] text-gray-400 sm:text-[2vh] mb-[2%]'>
                    Kg CO2
                  </div>
                </div>

                <div className='font-WorkSans text-[5vw] sm:text-[3vh] mb-[6%]'>
                  Ecolibrium Rank: {userData.globalRank}
                </div>
                <div className='font-WorkSans text-[4vw] sm:text-[2.5vh] text-center'>
                  Join me and begin your journey to save the environment at<b className='text-green-800'> ecolibrium.app </b>!
                </div>
              </div>
            </div>   
        </div>

         <button
            className="group inline-block my-5 rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
            onClick={()=>downloadImage(username)}
          >
            <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
              Download
            </span>
          </button>
         <p className='text-center text-xl sm:text-2xl '>Download your scorecard and share it with your friends on social media!</p>
        </>

      ) : (
        <>

        <div className="flex flex-col h-[90%] w-full justify-center items-center">
          <div className="text-3xl mb-6 text-black">Loading...</div>
           <LoadingSymbol type="spin" color="#000"/> 
        </div> 
        
      </>
      )}
    </div>
  </>
  );
};

export default UserDataCard;
