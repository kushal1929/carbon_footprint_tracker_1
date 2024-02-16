import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import './Tailwind.css';
import Header from './Header';

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
        const carbonScore = userDocSnapshot.exists() ? userDocSnapshot.data().totalCarbonFootprint : 'N/A';

        // Fetch global rank from Average/{currentMonthYear}/Leaderboard/{username}
        const leaderboardDocRef = doc(db, 'Average', currentMonthYear, 'Leaderboard', username);
        const leaderboardDocSnapshot = await getDoc(leaderboardDocRef);
        const rankCarbonFootprint = leaderboardDocSnapshot.exists() ? leaderboardDocSnapshot.data().rankCarbonFootprint : 'Unranked';
        const totalUsers = leaderboardDocSnapshot.exists() ? leaderboardDocSnapshot.data().totalUsers : '';
        const globalRank = rankCarbonFootprint !== 'Unranked'? `${rankCarbonFootprint}/${totalUsers}`:`${rankCarbonFootprint}`;

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
        <div className="w-[90vw] h-[90vw] sm:h-3/5 pt-1 sm:w-[60vh] bg-cover bg-[url('../../assets/image_1.jpg')]" ref={cardRef}>
            <div className="relative flex items-center h-[90%] w-[92%] m-[4%] rounded-[66px] bg-white pt-[5%]">
              <div className="relative w-full h-full flex flex-col items-center ">
                <div className='h-[10%] mb-[2%]'>
                  <img 
                    src={require("../../assets/Ecolibrium_Logo.png")}
                    className='h-full'      
                  />
                </div>
                <div className='font-PJSbold text-[7vw] sm:text-[5vh] mb-[4%]'>
                  Amazing {userData.username} !
                </div>
                <div className='font-WorkSans text-[6vw] sm:text-[4vh] mb-[4%]'>
                  Stats this month
                </div>
                <div className='font-WorkSans text-[5vw] sm:text-[3vh] mb-[4%]'>
                  Carbon Footprint: {userData.carbonScore.toFixed(3)} KgCO2
                </div>
                <div className='font-WorkSans text-[5vw] sm:text-[3vh] mb-[6%]'>
                  Global Rank: {userData.globalRank}
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
         <p className='text-2xl'>Download your scorecard and share it with your friends on social media!</p>
        </>
        
        // <div className="mt-[10%] w-[36%]" ref={cardRef}>
        //   <div>
        //   <h1 className='text-center text-emerald-600 text-xl font-extrabold sm:text-2xl'>
        //         {userData.username}'s Carbon Footprint
        //   </h1>
        //   </div>
          
        //   <div className="flex flex-col mt-[5%] ml-[24%] w-[50%] rounded-lg bg-blue-50 px-4 py-8 text-center">
        //      <dt className="order-last text-xl font-medium text-gray-500">Carbon Footprint</dt>

        //      <dd className="text-xl font-extrabold text-blue-600 md:text-2xl">{userData.carbonScore.toFixed(3)}</dd>
        //      <p className='text-[5px] text-center text-gray-300 sm:text-[15px]'>Kg CO2</p>
        //    </div>
        //    <div className="flex flex-col mt-[5%] ml-[24%] w-[50%] rounded-lg bg-blue-50 px-4 py-8 text-center">
        //      <dt className="order-last text-xl font-medium text-gray-500">Global Rank</dt>

        //      <dd className="text-xl font-extrabold text-blue-600 md:text-2xl">{userData.globalRank}</dd>
        //    </div>
        //    <div className='mt-[2.5%] mb-[5%]'>
        //         <p className='text-2xl text-center text-amber-500'>Can you beat my score?</p>
        //         <p className='text-2xl text-center text-amber-500'>Join me and embark on your journey to save the environment</p>
        //         <p className='text-2xl text-center text-amber-500'>@ https://ecolibrium.app/</p>
        //         <p>            .                      </p>
        //     </div>

          
        // </div>

      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  </>
  );
};

export default UserDataCard;
