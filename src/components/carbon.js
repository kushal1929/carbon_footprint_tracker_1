import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
} from 'firebase/firestore';
import Header from './common/Header';

export const CarbonFootprintCalculator = () => {
    const [electric, setElectric] = useState();
    const [LPG, setLPG] = useState();
    const [Coal, setCoal] = useState();
    const [Petrol, setPetrol] = useState();
    const [Diesel, setDiesel] = useState();
    const [CNG, setCNG] = useState();
    const [AutoLPG, setAutoLPG] = useState();
    let [totalCarbonFootprint, setTotalCarbonFootprint] = useState(null);
    const [username, setUsername] = useState('');

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const navigate = useNavigate();

    const calculateCarbonFootprint = async (totalCarbonFootprint) => {
        const newCarbonData = {
            electric,
            LPG,
            Coal,
            Petrol,
            Diesel,
            CNG,
            AutoLPG,
            totalCarbonFootprint,
            timestamp: new Date(),
        };

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
                const consumptionHomeRef = doc(currentMonthRef, 'consumptionHome');

                try {
                    await setDoc(consumptionHomeRef, newCarbonData);
                    console.log('Carbon footprint data saved to Firestore for the current month ', newCarbonData);
                    navigate('/home');
                } catch (error) {
                    console.error('Error saving carbon footprint data to Firestore:', error);
                    alert(error.message);
                }
            } else {
                console.log('User not found in Firestore');
                alert('User not found in Firestore');
            }
        }  catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data:', error.message);
        }
    };

    const handleCalculate = () => {
        const electricBillFactor = 0.93;
        const LPGFactor = 41.88;
        const CoalFactor = 2.87;
        const PetrolFactor = 2.33;
        const DieselFactor = 2.66;
        const CNGFactor = 2.73;
        const AutoLPGFactor = 2.95;

        let totalFootprint =
            electric * electricBillFactor +
            LPG * LPGFactor +
            Coal * CoalFactor +
            Petrol * PetrolFactor +
            Diesel * DieselFactor +
            CNGFactor * CNG +
            AutoLPGFactor * AutoLPG;
        
        setTotalCarbonFootprint(totalFootprint);
         calculateCarbonFootprint(totalFootprint);
        
    };

    return (
        <div>
            <h1>Carbon Footprint Calculator {username}</h1>
            <label>
                Enter unit of electricity consumed in one month:
                <input
                    type="number"
                    value={electric}
                    onChange={(e) => setElectric(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter the number of LPG cylinders consumed this month:
                <input
                    type="number"
                    value={LPG}
                    onChange={(e) => setLPG(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter weight of coal in kg used for domestic purpose this month:
                <input
                    type="number"
                    value={Coal}
                    onChange={(e) => setCoal(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter quantity of petrol (liters) consumed by your vehicle/s in one month:
                <input
                    type="number"
                    value={Petrol}
                    onChange={(e) => setPetrol(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter quantity of diesel (liters) consumed by your vehicle/s in one month:
                <input
                    type="number"
                    value={Diesel}
                    onChange={(e) => setDiesel(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter quantity of CNG (liters) consumed by your vehicle/s in one month:
                <input
                    type="number"
                    value={CNG}
                    onChange={(e) => setCNG(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Enter quantity of Auto LPG (liters) consumed by your vehicle/s in one month:
                <input
                    type="number"
                    value={AutoLPG}
                    onChange={(e) => setAutoLPG(Number(e.target.value))}
                />
            </label>
            <br />
            <button onClick={handleCalculate}>Calculate</button>
            <br />
            {totalCarbonFootprint !== null && (
                <p>Your estimated carbon footprint is: {totalCarbonFootprint} kgCO2 per month</p>
            )}
            {calculateCarbonFootprint}
        </div>
    );
};

export default CarbonFootprintCalculator;