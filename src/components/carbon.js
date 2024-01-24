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

export const CarbonFootprintCalculator = () => {
    const [electric, setElectric] = useState('');
    const [NaturalGas, setNaturalGas] = useState('');
    const [BioMass, setBioMass] = useState('');
    const [LPG, setLPG] = useState('');
    const [Coal, setCoal] = useState('');
    const [HeatingOil, setHeatingOil] = useState('');
    const [NumberOfPeople,setNumberOfPeople] = useState('');
    let [homeCarbonFootprint, setHomeCarbonFootprint] = useState(null);
    const [username, setUsername] = useState('');

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const navigate = useNavigate();

    const calculateCarbonFootprint = async (homeCarbonFootprint) => {
        const newCarbonData = {
            electric,
            NaturalGas,
            BioMass,
            LPG,
            Coal,
            HeatingOil,
            NumberOfPeople,
            homeCarbonFootprint,
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
                    await calculateAndStoreTotal(currentMonthRef,currentMonthYear,userDocRef);
                   // navigate('/home');
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

    const calculateAndStoreTotal = async (currentMonthRef,currentMonthYear,userDocRef) => {
        const totalDocRef = collection(userDocRef, 'Total');
        const totalMYDocRef=doc(totalDocRef,currentMonthYear)

        const querySnapshot = await getDocs(currentMonthRef);
    
        let totalHome = 0;
        let totalFood = 0;
        let totalVehicle = 0;
        let totalFlight = 0;
        let totalPublicVehicle = 0;
        let totalExpenditure = 0;
    
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalHome += data.homeCarbonFootprint || 0;
          totalFood += data.foodCarbonFootprint || 0;
          totalVehicle += data.vehicleCarbonFootprint || 0;
          totalFlight += data.flightCarbonFootprint || 0;
          totalPublicVehicle += data.PublicVehicleCarbonFootprint || 0;
          totalExpenditure += data.ExpenditureCarbonFootprint || 0;
        });
    
        const totalDocData = {
          totalHome,
          totalFood,
          totalVehicle,
          totalFlight,
          totalPublicVehicle,
          totalExpenditure,
          totalCarbonFootprint:
            totalHome + totalFood + totalVehicle + totalFlight + totalPublicVehicle + totalExpenditure,
            timestamp: new Date(),
        };
    
        try {
          await setDoc(totalMYDocRef, totalDocData);
          console.log('Total carbon footprint data saved to Firestore for the current month ', totalDocData);
        } catch (error) {
          console.error('Error saving total carbon footprint data to Firestore:', error);
          alert(error.message);
        }
      };

    const handleCalculate = (e) => {

        const electricBillFactor = 0.93;
        const NaturalGasFactor = 0.18;
        const BioMassFactor = 0.2;
        const LPGFactor = 3.3;
        const CoalFactor = 2.87;
        const HeatingOilFactor = 3.9;

        let totalFootprint =
            (electric * electricBillFactor +
            NaturalGas * NaturalGasFactor +
            BioMass * BioMassFactor +
            LPG * LPGFactor +
            Coal * CoalFactor +
            HeatingOil * HeatingOilFactor)/NumberOfPeople;

        setHomeCarbonFootprint(totalFootprint);
        calculateCarbonFootprint(totalFootprint);

    };

    return (
      <div className="flex flex-wrap flex-col items-center space-y-4 py-4">
        <div className="w-fit bg-gradient-to-r from-green-700 via-yellow-500 via-orange-400 to-green-600 bg-clip-text font-extrabold text-transparent sm:text-5xl">
          Carbon Footprint Calculator
        </div>
        <br />
        <div className="flex flex-row items-center mb-4">
          <span>Number of family member :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={NumberOfPeople}
              placeholder="Family Member's"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            />
          </label>
        </div>

        <br />

        <div className="flex flex-row items-center mb-4">
          <span>Electricity (in kwh) :</span>
          <label
            htmlFor="Electricity"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2"
          >
            <input
              type="number"
              value={electric}
              placeholder="in kwh"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setElectric(Number(e.target.value))}
            />
          </label>
        </div>

        <br />
        <div className="flex flex-row items-center mb-4">
          <span>NaturalGas(in kwh) :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={NaturalGas}
              placeholder="in kwh"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setNaturalGas(Number(e.target.value))}
            />
          </label>
        </div>

        <br />

        <div className="flex flex-row items-center mb-4">
          <span>BioMass(in kg) :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={BioMass}
              placeholder="in kg"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setBioMass(Number(e.target.value))}
            />
          </label>
        </div>

        <br />

        <div className="flex flex-row items-center mb-4">
          <span>Coal :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={Coal}
              placeholder="in kg"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setCoal(Number(e.target.value))}
            />
          </label>
        </div>

        <br />

        <div className="flex flex-row items-center mb-4">
          <span>HeatingOil :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={HeatingOil}
              placeholder="in liters"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setHeatingOil(Number(e.target.value))}
            />
          </label>
        </div>

        <br />

        <div className="flex flex-row items-center mb-4">
          <span>LPG :</span>
          <label className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 flex flex-row flex-col items-center ml-2">
            <input
              type="number"
              value={LPG}
              placeholder="in kg"
              className="block rounded-sm bg-white px-2 py-2 text-sm font-medium group-hover:bg-transparent"
              onChange={(e) => setLPG(Number(e.target.value))}
            />
          </label>
        </div>
        <br />
        <button onClick={handleCalculate}>
          <a className="group inline-block rounded bg-gradient-to-r from-green-700 via-yellow-500 via-orange-400 to-green-600 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75">
            <span className="block rounded-sm bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
              Calculate
            </span>
          </a>
        </button>
        <br />
        {homeCarbonFootprint !== null && (
          <p>
            Your estimated carbon footprint is: {homeCarbonFootprint} kgCO2 per
            month
          </p>
        )}
        {calculateCarbonFootprint}
      </div>
    );
};

export default CarbonFootprintCalculator;