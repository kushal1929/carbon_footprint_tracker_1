import React, { useEffect, useState, useRef } from "react";
import "./Tailwind.css";
import {
    getFirestore,
    collection,
    query,
    where,
    getDoc,
    doc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";

export default function LeaderBoard(){

    const [friendUser, setFriendUser] = useState('');
    const [error, setError] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [trigger, setTrigger] = useState('');
    const username = sessionStorage.getItem("Username");

    const handleSearch = async () => {
        try {
          const db = getFirestore();
          const userDocRef = doc(db, 'users', friendUser);
          const userDoc = await getDoc(userDocRef);  

          if (userDoc.exists()) {
            console.log('User found');
      
            const currentDate = new Date();
            const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    
            
            const friendDocRef = doc(db, 'users', friendUser, 'Total', currentMonthYear);
            const friendDoc = await getDoc(friendDocRef);
      
            if (friendDoc.exists()) {
              const friendData = friendDoc.data();
              const carbonFootprint = friendData.totalCarbonFootprint;

              const friendListDocRef = doc(db, 'users', username, 'Friends','FriendList');
            

              const myDocRef = doc(db, 'users', username, 'Total', currentMonthYear);
              const myDoc = await getDoc(myDocRef);

              if(myDoc.exists()){
                  const myData = myDoc.data();
                  const myFootprint = myData.totalCarbonFootprint;
                  await setDoc(friendListDocRef,{ [username]:myFootprint, [friendUser]:carbonFootprint },{merge:true});
      
              }
              else{
                await setDoc(friendListDocRef, { [friendUser]:carbonFootprint },{merge:true});
              }

  
              
              setTrigger(carbonFootprint);
              console.log('Friend added to the Friends collection successfully.');
            } else {
                setError('NoFriendDoc')
              console.log('Friend document not found for the specified month and year.');
            }
          } else {
            setError('UserNotFound')
            console.log('User not found');
          }
        } catch (error) {
          console.error('Error searching for user:', error.message);
        }
      };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         console.log("enter");
    //         const db = getFirestore();
    //         const FriendDocRef = doc(db,"users",username,"Friends","FriendList");
    //         const friendlistSnapshot = await getDoc(FriendDocRef);
            
    //         const friendlistData = friendlistSnapshot.data();
    
    //         if (friendlistData) {
    //           const leaderboardData = Object.entries(friendlistData).map(([username, carbonFootprint]) => ({
    //             username,
    //             carbonFootprint,
    //           }));
              
    //           // Sort leaderboard data based on carbon footprint
    //           leaderboardData.sort((a, b) => a.carbonFootprint - b.carbonFootprint);
    //           console.log("enter2");
    //           console.log(leaderboardData);
    //           setLeaderboardData(leaderboardData.slice(0, 10)); // Limit to top 10
    //         }
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

        const currentDate = new Date();
        const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const FriendDocRef = doc(db,"users",username,"Friends","FriendList");
        const friendlistSnapshot = await getDoc(FriendDocRef);

        const friendlistData = friendlistSnapshot.data();

        if (friendlistData) {
          const updatedLeaderboardData = await Promise.all(
            Object.entries(friendlistData).map(async ([username, _]) => {
              const totalSnapshot = await getDoc(doc(db,'users', username, 'Total', currentMonthYear));
              const totalData = totalSnapshot.data();

              return {
                username,
                carbonFootprint: totalData?.totalCarbonFootprint || 0,
              };
            })
          );

          // Sort updated leaderboard data based on carbon footprint
          updatedLeaderboardData.sort((a, b) => a.carbonFootprint - b.carbonFootprint);

          setLeaderboardData(updatedLeaderboardData.slice(0, 10)); // Limit to top 10
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [trigger]);
      

    return(
      <>
        <div className="text-center text-4xl">
          <span className="text-emerald-600">Compete</span> with your friends!
        </div>

        <div className="text-center text-2xl">
          Enter their usernames to add them 
        </div>

        <div className="flex justify-center w-[80vw] sm:w-[30vw] gap-x-2 mt-4">
          <label
            htmlFor="Username"
            className="relative w-[75%] block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <input
              type="text"
              value={friendUser}
              onChange={(e) => setFriendUser(e.target.value)}
              id="Username"
              className="h-10 peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Username"
            />

            <span
              className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
            >
              Username
            </span>
          </label>
        
          <button
            onClick={handleSearch}
            className="group w-[20%] inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          >
            <span className="block rounded-sm bg-white px-auto py-3 text-sm font-medium group-hover:bg-transparent">
              Add
            </span>
          </button>
        </div>
        
        <div>
            {error==='UserNotFound' && (
                <p className="text-red-600">Username not found!</p>
            )}
            {error==='NoFriendDoc' && (
                <p className="text-red-600">{friendUser} has not filled data this month!</p>
            )}
        </div>

        <section className="w-[90%] sm:w-3/5 relative py-16 bg-blueGray-50">
        <div className="w-full mb-12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded 
          bg-lime-900 text-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 ">
                  <h3 className="font-semibold text-lg text-white">Leaderboard</h3>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto ">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lime-800 text-lime-300 border-lime-700">Position</th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lime-800 text-lime-300 border-lime-700">Username</th>
                    <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lime-800 text-lime-300 border-lime-700">Carbon Footprint</th>
                  </tr>
                </thead>

                <tbody>
                  
                  

                  

                {leaderboardData.map((entry, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                      
                      <span className="ml-3 font-bold text-white">{index+1}
                      </span></th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{entry.username}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-circle text-emerald-500 mr-2"></i>{entry.carbonFootprint}</td>
                    
                    
                  </tr>
                ))}
                
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </section> 
         

    </>
    
    )
}