import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

const EatingHabits = () => {
  const [username, setUsername] = useState('');
  const [foodCarbonFootprint, setFoodCarbonFootprint] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState({
    highMeatEater: 0,
    mediumMeatEater: 0,
    lowMeatEater: 0,
    fishEater: 0,
    vegetarian: 0,
    vegan: 0,
  });

  const navigate = useNavigate();

  const handleDropdownChange = (question, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [question]: parseInt(value, 10),
    }));
  };

  const saveEatingHabits = async () => {
    const totalSelected = Object.values(selectedOptions).reduce((acc, value) => acc + value, 0);

    if (totalSelected === 7) {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const userEmail = sessionStorage.getItem('User Email');
      const userQuery = query(usersCollection, where('email', '==', userEmail));

      try {
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUsername(userDoc.id || '');

          const userDocRef = doc(usersCollection, userDoc.id);

          // Include year in the current month
          const currentDate = new Date();
          const currentMonthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
          const currentMonthRef = collection(userDocRef, currentMonthYear);

          // Use consumptionHome as the document id
          const consumptionFoodRef = doc(currentMonthRef, 'consumptionFood');

          const newEatingHabit = {
            selectedOptions,
            foodCarbonFootprint: calculateTotalCarbonFootprint(selectedOptions),
            timestamp: new Date().toISOString(),
          };
          setFoodCarbonFootprint(newEatingHabit.foodCarbonFootprint);
          try {
            await setDoc(consumptionFoodRef, newEatingHabit);
            console.log('Eating habits data saved to Firestore for the current month');
            navigate('/home');
          } catch (error) {
            console.error('Error saving eating habits data to Firestore:', error);
            alert(error.message);
          }
        } else {
          console.log('User not found in Firestore');
          alert('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data:', error.message);
      }
    } else {
      alert('Please ensure the values add up to 7.');
    }
  };
  
  const calculateRemainingValue = () => {
    const totalSelected = Object.values(selectedOptions).reduce((acc, value) => acc + value, 0);
    return 7 - totalSelected;
  };

  // Function to display remaining days information
  const displayRemainingDaysInfo = () => {
    const remainingValue = calculateRemainingValue();
    if (remainingValue === 0) {
      return <p>All days are accounted for.</p>;
    } else if (remainingValue > 0) {
      return <p>{remainingValue} days need to be accounted for.</p>;
    } else {
      return <p>{Math.abs(remainingValue)} days need to be removed.</p>;
    }
  };
  
  const calculateTotalCarbonFootprint = (options) => {
    const {
      highMeatEater,
      mediumMeatEater,
      lowMeatEater,
      fishEater,
      vegetarian,
      vegan,
    } = options;

    const totalFootprint =
      42.42857 * highMeatEater +
      30 * mediumMeatEater +
      23.1428 * lowMeatEater +
      20.4285 * fishEater +
      18 * vegetarian +
      10.714285 * vegan;

    return totalFootprint;
  };
//   const displaySelectedValues = () => {
//     return (
//       <div>
//         <h2>Selected Values:</h2>
//         <ul>
//           {Object.entries(selectedOptions).map(([question, value]) => (
//             <li key={question}>
//               {question}: {value}
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

  return (
    <div>
      <h1>Eating Habits</h1>
      <form>
        <div>
            In the current month, how many days a week were you
        </div>
        <div>
          <label>High Meat-eater:</label>
          <select
            value={selectedOptions.highMeatEater}
            onChange={(e) => handleDropdownChange('highMeatEater', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Medium Meat-eater:</label>
          <select
            value={selectedOptions.mediumMeatEater}
            onChange={(e) => handleDropdownChange('mediumMeatEater', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Low Meat-eater:</label>
          <select
            value={selectedOptions.lowMeatEater}
            onChange={(e) => handleDropdownChange('lowMeatEater', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fish Eater</label>
          <select
            value={selectedOptions.fishEater}
            onChange={(e) => handleDropdownChange('fishEater', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Vegetarian:</label>
          <select
            value={selectedOptions.vegetarian}
            onChange={(e) => handleDropdownChange('vegetarian', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Vegan:</label>
          <select
            value={selectedOptions.vegan}
            onChange={(e) => handleDropdownChange('vegan', e.target.value)}
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
            {/* Display remaining days information */}
            {displayRemainingDaysInfo()}
        </div>
        <div>
        {foodCarbonFootprint !== null && (
        <div>
          <h2>Total Food Carbon Footprint:</h2>
          <p>{foodCarbonFootprint} KgCO2</p>
        </div>
      )}
        </div>
        {/* Display the values selected in the dropdown for each
        {displaySelectedValues()} */}
               
        {/* Similar blocks for other questions */}
        {/* Copy the above block for each question, replacing 'highMeatEater' with the respective question identifier */}

        <button type="button" onClick={saveEatingHabits}>
          Save Eating Habits
        </button>
      </form>
    </div>
  );
};

export default EatingHabits;
