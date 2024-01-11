import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getFirestore, getDocs } from 'firebase/firestore';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem('Auth Token');
    sessionStorage.removeItem('User Email'); // Clear user email on logout
    sessionStorage.clear();
    navigate('/login');
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

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}
