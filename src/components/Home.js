import React, { useEffect, useState , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getFirestore, getDocs, orderBy } from 'firebase/firestore';
import { app } from '../firebaseconfig';
import { Line } from 'react-chartjs-2';
import "chart.js/auto";
import Header from './common/Header'
import './common/Tailwind.css';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({});

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    sessionStorage.removeItem('User Email'); // Clear user email on logout
    sessionStorage.clear();
    navigate('/');
  };

  const handleNavigateToCarbon = () => {
    navigate('/carbon-footprint-calc');
  };

  const handleNavigateToEatingHabits = () => {
    navigate('/eating-habits');
  };

  useEffect(() => {
    const userEmail = sessionStorage.getItem('User Email');

    if (!userEmail) {
      navigate('/login'); // Redirect to login if user email is not found
      return;
    }

    const db = getFirestore();
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('email', '==', userEmail));

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUsername(doc.id || '');
          });
        } else {
          console.log('User not found in Firestore');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError(error);
        setLoading(false);
      });
  }, [navigate]);


  const isFirstRender = useRef(true);
  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchConsumptionData = async () => {
      try {

        const db = getFirestore();
        const consumptionDataCollection = collection(db, 'users', username, 'consumptionData');
        const consumptionDataQuery = query(consumptionDataCollection, orderBy("timestamp","asc"));
        const consumptionDataSnapshot = await getDocs(consumptionDataQuery);

        if (consumptionDataSnapshot.empty) {
          console.log('No matching documents for consumption data.');
        }
        else{
          const months = [];
          const totalCarbonFootprintValues = [];

          consumptionDataSnapshot.docs.forEach(doc => {
            //console.log(doc.id);
            //console.log(doc.data());
            const data = doc.data();
            const month = doc.id; // Assuming the document ID is the month
            const totalCarbonFootprint = data.totalCarbonFootprint;

            months.push(month);
            totalCarbonFootprintValues.push(totalCarbonFootprint);
            console.log(months);
            console.log(totalCarbonFootprintValues);
          });

          setChartData({
            labels: months,
            datasets: 
            [
              {
                label: 'Total Carbon Footprint',
                data: totalCarbonFootprintValues,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
              },
            ],
          });

      } 
    }
    catch (error) {
      console.error('Error fetching consumption data:', error);
    }
  };

    fetchConsumptionData();
  }, [username]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }


  


  return (
    <div>
      <h1>Welcome, {username}!</h1>

      <button onClick={handleNavigateToCarbon}>Calculate Carbon Footprint</button>
      <button onClick={handleNavigateToEatingHabits}>Eating Habits</button>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}