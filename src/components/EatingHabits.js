import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, addDoc, collection ,query,where,getDocs,setDoc} from 'firebase/firestore';
import Header from './common/Header'

export const EatingHabits = () => {
    const [foodType, setFoodType] = useState('');
    const [calories, setCalories] = useState('');
    const [username, setUsername] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const navigate = useNavigate();

    const handleOptionChange = (foodType) => {
        if (selectedOptions.includes(foodType)) {
            setSelectedOptions(selectedOptions.filter(option => option !== foodType));
        } else {
            setSelectedOptions([...selectedOptions, foodType]);
        }
    };

    const saveEatingHabits = async () => {
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const userEmail = sessionStorage.getItem('User Email');
        const userQuery = query(usersCollection, where('email', '==', userEmail));
        // const eatingHabitsCollection = collection(userDocRef, 'EatingHabits');

        const newEatingHabit = {
            foodType,
            calories,
            selectedOptions,
            timestamp: new Date().toISOString(),
        };

        // try {
        //     await addDoc(eatingHabitsCollection, newEatingHabit);
        //     console.log('Eating habits saved to Firestore');
        //     navigate('/home');
        // } catch (error) {
        //     console.error('Error saving eating habits to Firestore:', error);
        // }
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

                try {
                    await setDoc(consumptionFoodRef,newEatingHabit);
                    console.log('Carbon footprint data saved to Firestore for the current month');
                    //navigate('/home');
                } catch (error) {
                    console.error('Error saving carbon footprint data to Firestore:', error);
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
    };
    

    return (
        <>
        <Header/>
        <div>
            <h1>Eating Habits</h1>
            <h2>Do you eat any of the following food often?</h2>
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('beef')}
                    onChange={() => handleOptionChange('beef')}
                />
                Beef
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('fish')}
                    onChange={() => handleOptionChange('fish')}
                />
                Fish
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('chicken')}
                    onChange={() => handleOptionChange('chicken')}
                />
                Chicken
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('rice')}
                    onChange={() => handleOptionChange('rice')}
                />
                Rice
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('wheat')}
                    onChange={() => handleOptionChange('wheat')}
                />
                Wheat
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Cheese')}
                    onChange={() => handleOptionChange('Cheese')}
                />
                Cheese
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Lamb and Mutton')}
                    onChange={() => handleOptionChange('Lamb and Mutton')}
                />
                Lamb and Mutton
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Chocolate')}
                    onChange={() => handleOptionChange('Chocolate')}
                />
                Chocolate
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Eggs')}
                    onChange={() => handleOptionChange('Eggs')}
                />
                Eggs
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Prawns')}
                    onChange={() => handleOptionChange('Prawns')}
                />
                Prawns
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Pig Meat')}
                    onChange={() => handleOptionChange('Pig Meat')}
                />
                Pig Meat
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Olive Oil')}
                    onChange={() => handleOptionChange('Olive Oil')}
                />
                Olive Oil
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Nuts')}
                    onChange={() => handleOptionChange('Nuts')}
                />
                Nuts
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Cane Sugar')}
                    onChange={() => handleOptionChange('Cane Sugar')}
                />
                Cane Sugar
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Turkey')}
                    onChange={() => handleOptionChange('Turkey')}
                />
                Turkey
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={selectedOptions.includes('Lentils')}
                    onChange={() => handleOptionChange('Lentils')}
                />
                Lentils
            </label>
            <br />
            <p>Selected Options: {selectedOptions.join(', ')}</p>
            <button onClick={saveEatingHabits}>Save Eating Habits</button>
        </div>
        </>
    );
};

export default EatingHabits;