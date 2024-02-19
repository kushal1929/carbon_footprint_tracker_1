import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Header from './common/Header';
import './common/Tailwind.css';
import { FaQuestionCircle ,FaEdit} from 'react-icons/fa';
import {toast} from 'react-toastify';
import { CircularProgressbar,CircularProgressbarWithChildren, buildStyles} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function WeeklyTargets() {
  const [targets, setTargets] = useState({
    publicTransportTarget: 0,
    walkOrCycleTarget: 0,
    vegetarianFoodTarget: 0,
    publicTransportCount: 0,
    walkOrCycleCount: 0,
    vegetarianFoodCount: 0,
    lastResetTimestamp: null,
    lastFilledDate : null,
  });

  const [tooltipVisible1, setTooltipVisible1] = useState(false);
  const toggleTooltip1 = () => {
    setTooltipVisible1(!tooltipVisible1);
  };

  const [isEditing, setIsEditing] = useState({
    publicTransportTarget: false,
    walkOrCycleTarget: false,
    plasticUsageTarget: false,
    vegetarianFoodTarget: false,
  });
  const [username, setUsername] = useState('');
  // const [plasticInput, setPlasticInput] = useState('');
  const [formFilledForToday, setFormFilledForToday] = useState(false);

  useEffect(() => {
    const fetchTargets = async () => {
      
    const Username = sessionStorage.getItem('Username');
    if(Username)
    {
        setUsername(Username);
        try {

 

            const db = getFirestore();
            const userDocRef = doc(db, 'weeklytargets', Username);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (shouldResetCounts(data.lastResetTimestamp)) {
              await resetCounts(Username);
              } else {
                setTargets(data);
              }
              if (isFilledForToday(data.lastFilledDate)) {
                setFormFilledForToday(true);
              }
            } else {
              await resetCounts();
            }


      } catch (error) {
        console.error('Error fetching targets:', error);
      }
              }
        else{
            console.log('Username not defined or null');
        } 
    };

    fetchTargets();
  }, []);

  const shouldResetCounts = (timestamp) => {
    if (!timestamp) return true;
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const difference = Date.now() - timestamp.toMillis();
    return difference >= oneWeekInMilliseconds;
  };


  const isFilledForToday = (lastFilledDate) => {
    if (!lastFilledDate) return false; // If lastFilledDate is null, form is not filled for today
    const today = new Date();
    const lastFilledDay = lastFilledDate.toDate();
    return (
      today.getDate() === lastFilledDay.getDate() &&
      today.getMonth() === lastFilledDay.getMonth() &&
      today.getFullYear() === lastFilledDay.getFullYear()
    );
  };
  const resetCounts = async (username) => {
    try {

      const db = getFirestore();
      // console.log(username,"username");
      const userDocRef = doc(db, 'weeklytargets', username);
      // console.log(userDocRef.path,'path')
      await setDoc(userDocRef, {
        ...targets,
        publicTransportCount: 0,
        walkOrCycleCount: 0,
        plasticUsageCount: 0,
        vegetarianFoodCount: 0,
        lastResetTimestamp: new Date(),
        lastFilledDate: new Date(),
      });
      toast.success('Week complete all values are refreshed');
    } catch (error) {
      // console.error('Error resetting counts:', error);
    }
  };

  const handleDropdownChange = (targetName, value) => {
    setTargets(prevTargets => ({
      ...prevTargets,
      [targetName]: value,
    }));
  };

  const handleUpdateTarget = async (targetName) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'weeklytargets', username);
      await setDoc(userDocRef, { ...targets, 
        publicTransportCount: 0,
        walkOrCycleCount: 0,
        vegetarianFoodCount: 0,
        lastResetTimestamp: new Date(),
        lastFilledDate : new Date(),
    }, { merge: true });
      console.log('Target updated successfully:', targetName);
      setIsEditing(prevState => ({
        ...prevState,
        [targetName]: false,
      }));
    } catch (error) {
      // console.error('Error updating target:', error);
    }
  };

  const handleIncrementCount = async (targetName, value) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'weeklytargets', username);
      const countIncrement = value ? 1 : 0; // Increment count if value is true (Yes), otherwise keep it unchanged
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        await setDoc(
          userDocRef,
          {
            ...data, // Include existing data
            [`${targetName}Count`]: data[`${targetName}Count`] + countIncrement,
            lastFilledDate: new Date(),
          },
          { merge: true }
        );
        setTargets(prevTargets => ({
          ...prevTargets,
          [`${targetName}Count`]: data[`${targetName}Count`] + countIncrement,
        }));
        toast.success('Count incremented successfully');
      } else {
        // console.error('Document does not exist.');
      }
    } catch (error) {
      // console.error('Error incrementing count:', error);
    }
  };
  

  return (
    <div>
      <Header />
      <div className='flex flex-col items-center mt-8'>
        <h1
          className="mb-2 w-fit bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
        >
          Weekly Targets
        </h1>
        <FaQuestionCircle
              className="mx-auto"
              onMouseEnter={toggleTooltip1}
              onMouseLeave={toggleTooltip1}
            />
            {tooltipVisible1 && (
              <div className="bg-white p-2 rounded shadow-lg z-10">
                <div className="flex flex-col z-10">
                  <p className="text-xs">
                    If you wish to Edit the Target values then it will result in the week to be started at the updation time and all previous progress will be nullified.
                  </p>
                </div>
              </div>
            )}
      </div>
    <div className='flex flex-row flex-wrap-reverse'>
    <div className='w-full sm:w-3/5 mt-16 px-4 sm:px-0'>
      <h2 className='font-bold text-amber-500 text-3xl ml-[2%]'>Targets you have set:</h2>
      <div className='flex flex-col items-start ml-[2%] mt-[2%]'>
        <div className='flex flex-row text-xl'>

          <div>Use public transport or carpooling to go to work:</div>{' '}
          {!isEditing.publicTransportTarget ? (
            <>
            <div className='w-[5vw] text-center pt-3 sm:pt-0'>

                {targets.publicTransportTarget}

            </div>
            <button onClick={() => setIsEditing(prevState => ({ ...prevState, publicTransportTarget: true }))}><FaEdit/></button>
            </>
          ) : (
            <div className='flex flex-row ml-2'>
              <div>
                <select value={targets.publicTransportTarget} onChange={(e) => handleDropdownChange('publicTransportTarget', parseInt(e.target.value))}>
                  {[...Array(7)].map((_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <button onClick={() => handleUpdateTarget('publicTransportTarget')} 
              className="ml-2 group relative inline-block focus:outline-none focus:ring"
              >
                <span
                  className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
                ></span>

                <span
                  className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
                >
                  Update
                </span>
              </button>
              </div>

              



            </div>
          )}
        </div>

        <div className='flex flex-row text-xl'>
          <div>Walk or cycle for errands within 2-3km radius:</div>{' '}
          {!isEditing.walkOrCycleTarget ? (
            <>
            <div className='w-[5vw] text-center pt-3 sm:pt-0'>
              
                {targets.walkOrCycleTarget}
              
            </div>
            <button onClick={() => setIsEditing(prevState => ({ ...prevState, walkOrCycleTarget: true }))}><FaEdit/></button>
            </>
          ) : (
            <div className='flex flex-row ml-2'>
              <div>
                <select value={targets.walkOrCycleTarget} onChange={(e) => handleDropdownChange('walkOrCycleTarget', parseInt(e.target.value))}>
                  {[...Array(7)].map((_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                  <button onClick={() => handleUpdateTarget('walkOrCycleTarget')}
                  className="ml-2 group relative inline-block focus:outline-none focus:ring"
                  >
                    <span
                      className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
                    ></span>

                    <span
                      className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
                    >
                      Update
                    </span>
                  </button>
              </div>

            </div>
          )}
        </div>

        <div className='flex flex-row text-xl'>
          <div>Consumption of vegetarian food or low meat food:</div>{' '}
          {!isEditing.vegetarianFoodTarget ? (
            <>
            <div className=' w-[5vw] text-center pt-3 sm:pt-0'>
              
                {targets.vegetarianFoodTarget}
                        
            </div>
            <button onClick={() => setIsEditing(prevState => ({ ...prevState, vegetarianFoodTarget: true }))}><FaEdit/></button>
            </>
          ) : (
            <div className='flex flex-row ml-2'>
              <div>
                <select value={targets.vegetarianFoodTarget} onChange={(e) => handleDropdownChange('vegetarianFoodTarget', parseInt(e.target.value))}>
                  {[...Array(7)].map((_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </div>
              <div>
               <button onClick={() => handleUpdateTarget('vegetarianFoodTarget')}
                  className="ml-2 group relative inline-block focus:outline-none focus:ring"
                  >
                    <span
                      className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"
                    ></span>

                    <span
                      className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75"
                    >
                      Update
                    </span>
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col items-start mt-[8%] sm:mt-[3%] ml-[2%] text-xl'>
        <h2 className='text-center font-bold text-amber-500 text-3xl'>Your progress across the week so far:</h2>
          <div className='flex flex-row'>
            <div>Public Transport progress:</div>
            <div className='w-[20vw] sm:w-[5vw] text-center'>{targets.publicTransportCount+"/"+targets.publicTransportTarget}</div>
          </div>

          <div className='flex flex-row'>
            <div>Walk or cycle progress: </div>
            <div className='w-[20vw] sm:w-[5vw] text-center'>{targets.walkOrCycleCount+"/"+targets.walkOrCycleTarget}</div>
          </div>
          
          <div className='flex flex-row'>
            <div>Food progress: </div>
            <div className='w-[20vw] sm:w-[5vw] text-center'>{targets.vegetarianFoodCount+"/"+targets.vegetarianFoodTarget}</div>
          </div>
      </div>
      {formFilledForToday && <p className="text-4xl text-red-700 ml-[2%] mt-[8%] sm:mt-[2%] text-center sm:text-left">You have already filled today!</p>}
      <div className='flex flex-col items-center sm:items-start ml-[2%] mt-[8%] sm:mt-[5%] text-xl'>
        <h2 className='font-bold text-amber-500 text-3xl text-center sm:text-left'>Today's progress:</h2>
        <div className='flex flex-row flex-wrap text-center sm:text-left justify-center'>
          <div>Did you use public transport or carpool to go to work today?</div>{' '}
          <span className="ml-0 sm:ml-5 inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
            <button onClick={() => handleIncrementCount('publicTransport', true)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              Yes
            </button>

            <button onClick={() => handleIncrementCount('publicTransport', false)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              No
            </button>
          </span>
          
        </div>

        <div className='flex flex-row flex-wrap text-center sm:text-left justify-center'>
          <div>Did you cycle or walk to do errands within (2 or 3 kms) instead of taking a car or motorcycle?</div>{' '}
          <span className="ml-5 inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
            <button onClick={() => handleIncrementCount('walkOrCycle', true)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              Yes
            </button>

            <button onClick={() => handleIncrementCount('walkOrCycle', false)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              No
            </button>
          </span>
        </div>

        <div className='flex flex-row flex-wrap text-center sm:text-left justify-center'>
          <div>Did you consume only vegetarian or low meat foods today?</div>{' '}
          <span className="ml-5 inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
            <button onClick={() => handleIncrementCount('vegetarianFood', true)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              Yes
            </button>

            <button onClick={() => handleIncrementCount('vegetarianFood', false)}
              className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            >
              No
            </button>
          </span>
        </div>

        {/* Add more questions here as needed */}
      </div>


      </div>
      <div className='min-w-[200px] sm:min-w-0  w-screen sm:w-2/5 p-5 sm:pr-10 flex flex-col'>
        <div>
          <CircularProgressbarWithChildren
            value={(targets.walkOrCycleCount/targets.walkOrCycleTarget)*100}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: "#f00",
              trailColor: "#fca2a2"
            })}
          >
            
            <div style={{ width: "84%" }}>
              <CircularProgressbarWithChildren
                value={(targets.publicTransportCount/targets.publicTransportTarget)*100}
                styles={buildStyles({
                  pathColor: "#f5b342",
                  trailColor: "#fccfa2"
                })}
              >
                <div style={{ width: "84%" }}>
                  <CircularProgressbar
                    value={(targets.vegetarianFoodCount/targets.vegetarianFoodTarget)*100}
                    
                    styles={buildStyles({
                      trailColor: "#a6e7f7"
                    })}
                  />
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </CircularProgressbarWithChildren>   
        </div>

        <div className='flex flex-row mt-6 justify-around'>
          <div className='flex flex-row'>
            <div className="block size-8 rounded-full bg-red-500 shadow-sm"/>
            <div>Walk/Cycle</div>
          </div>
          <div className='flex flex-row'>
            <div className="block size-8 rounded-full bg-amber-400 shadow-sm"/>
            <div>Public Transport</div>
          </div>
          <div className='flex flex-row'>
            <div className="block size-8 rounded-full bg-blue-500 shadow-sm"/>
            <div>Veg/Low Meat food</div>
          </div>
          
          
        </div>         
      </div>

    </div>

    


  </div>
  );
}

export default WeeklyTargets;
