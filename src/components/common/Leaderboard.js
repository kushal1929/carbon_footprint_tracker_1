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

        <div className="flex gap-x-2 mt-4">
          <label
            htmlFor="Username"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
            className="group inline-block rounded bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
          >
            <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
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
        
        <div>
            <h1>Leaderboard</h1>
            <table>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Carbon Footprint</th>
                </tr>
                </thead>
                <tbody>
                {leaderboardData.map((entry, index) => (
                    <tr key={index}>
                    <td>{entry.username}</td>
                    <td>{entry.carbonFootprint}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </>
    )
}