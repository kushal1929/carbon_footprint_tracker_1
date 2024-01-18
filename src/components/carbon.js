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
    const [NaturalGas, setNaturalGas] = useState();
    const [BioMass, setBioMass] = useState();
    const [LPG, setLPG] = useState();
    const [Coal, setCoal] = useState();
    const [HeatingOil, setHeatingOil] = useState();
    const [Petrol, setPetrol] = useState();
    const [Diesel, setDiesel] = useState();
    const [CNG, setCNG] = useState();
    const [AutoLPG, setAutoLPG] = useState();
    let [totalCarbonFootprintHome, setTotalCarbonFootprintHome] = useState(null);
    let [totalCarbonFootprint, setTotalCarbonFootprint] = useState(null);
    const [username, setUsername] = useState('');

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const navigate = useNavigate();

    const calculateHomeCarbonFootprint = () => {
        const electricBillFactor = 0.3;
        const NaturalGasFactor = 0.18;
        const BioMassFactor = 0.2;
        const LPGFactor = 3.3;
        const CoalFactor = 2.87;
        const HeatingOilFactor = 3.9;

        const totalCarbonFootprintHome =
            electric * electricBillFactor +
            NaturalGas * NaturalGasFactor +
            BioMass * BioMassFactor +
            LPG * LPGFactor +
            Coal * CoalFactor +
            HeatingOil * HeatingOilFactor;

        setTotalCarbonFootprintHome(totalCarbonFootprintHome);

        return totalCarbonFootprintHome; // Return the value instead of setting state
    };

    const saveHomeCarbonFootprintData = async () => {
        const totalCarbonFootprintHome = calculateHomeCarbonFootprint();

        const newHomeCarbonData = {
            electric,
            NaturalGas,
            BioMass,
            LPG,
            Coal,
            HeatingOil,
            totalCarbonFootprintHome,
            timestamp: new Date(),
        };

        // Saving home carbon footprint data to Firestore
        const userEmail = sessionStorage.getItem('User Email');
        const userQuery = query(usersCollection, where('email', '==', userEmail));

        try {
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setUsername(userDoc.id || '');

                const userDocRef = doc(usersCollection, userDoc.id);
                const consumptionDataCollection = collection(userDocRef, 'consumptionData');
                const currentMonth = new Date().toLocaleString('default', { month: 'long' });
                const currentMonthDocRef = doc(consumptionDataCollection, currentMonth);

                try {
                    await setDoc(currentMonthDocRef, newHomeCarbonData);
                    console.log('Home carbon footprint data saved to Firestore under consumptionData for the current month ', newHomeCarbonData);
                } catch (error) {
                    console.error('Error saving home carbon footprint data to Firestore:', error);
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

    const calculateCarbonFootprint = async (totalCarbonFootprint) => {
        await saveHomeCarbonFootprintData(); // Wait for home data to be saved

        const newCarbonData = {
            electric,
            NaturalGas,
            BioMass,
            LPG,
            Coal,
            HeatingOil,
            Petrol,
            Diesel,
            CNG,
            AutoLPG,
            totalCarbonFootprintHome,
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
                const consumptionDataCollection = collection(userDocRef, 'consumptionData');
                const currentMonth = new Date().toLocaleString('default', { month: 'long' });
                const currentMonthDocRef = doc(consumptionDataCollection, currentMonth);

                try {
                    await setDoc(currentMonthDocRef, newCarbonData);
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
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data:', error.message);
        }
    };

    const handleCalculate = () => {
        const PetrolFactor = 2.33;
        const DieselFactor = 2.66;
        const CNGFactor = 2.73;
        const AutoLPGFactor = 2.95;
        const electricBillFactor = 0.3;
        const NaturalGasFactor = 0.18;
        const BioMassFactor = 0.2;
        const LPGFactor = 3.3;
        const CoalFactor = 2.87;
        const HeatingOilFactor = 3.9;

        let totalFootprint =
            electric * electricBillFactor +
            NaturalGas * NaturalGasFactor +
            BioMass * BioMassFactor +
            LPG * LPGFactor +
            Coal * CoalFactor +
            HeatingOil * HeatingOilFactor +
            Petrol * PetrolFactor +
            Diesel * DieselFactor +
            CNG * CNGFactor +
            AutoLPG * AutoLPGFactor;

        setTotalCarbonFootprint(totalFootprint);
          calculateCarbonFootprint(totalFootprint);
    };

    return (
        <>
            <Header />
            <div>
                <h1><b>Carbon Footprint Calculator {username}</b></h1>
                <h2><b>Home</b></h2>
                <label>
                    Enter unit of electricity (in kWh) consumed in one month:
                    <input
                        type="number"
                        value={electric}
                        onChange={(e) => setElectric(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Enter unit of Natural Gas(in kWh) consumed in one month:
                    <input
                        type="number"
                        value={NaturalGas}
                        onChange={(e) => setNaturalGas(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Enter unit of BioMass(in kg) consumed in one month:
                    <input
                        type="number"
                        value={BioMass}
                        onChange={(e) => setBioMass(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Enter the amount LPG(in kg) consumed this month:
                    <input
                        type="number"
                        value={LPG}
                        onChange={(e) => setLPG(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Enter weight of coal(in kg) used for domestic purpose this month:
                    <input
                        type="number"
                        value={Coal}
                        onChange={(e) => setCoal(Number(e.target.value))}
                    />
                </label>
                <br />
                <label>
                    Enter the amount of HeatingOil(in liters) consumed:
                    <input
                        type="number"
                        value={HeatingOil}
                        onChange={(e) => setHeatingOil(Number(e.target.value))} />
                </label>
                <br />
                <br />
                <button onClick={saveHomeCarbonFootprintData}>Calculate CarbonFootPrint Produced from Home</button>
                <br />
                {totalCarbonFootprintHome !== null && (
                    <p>Your estimated carbon footprint produced from home is: {totalCarbonFootprintHome} kgCO2 per month</p>
                )}
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
            </div>
        </>
    );
};

export default CarbonFootprintCalculator;
